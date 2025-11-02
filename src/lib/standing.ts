import { unstable_cache } from "next/cache";
import atsuocoder_db, { getContest } from "./atsuocoder_db";
import { evalSubmission, JudgeStatus } from "./submission";

export const getContestStandings = unstable_cache(
	async (url_id: string, rated_only: boolean = false) => {

		const contestData = await getContest(url_id);

		if (!contestData) {

			return null;

		}

		const submissions = await atsuocoder_db.submission.findMany({
			where: {
				contestUnique_id: contestData.unique_id,
				created_at: {
					lte: contestData.end_time,
				},
			},
			orderBy: {
				created_at: "asc",
			},
		});

		const registrations = await atsuocoder_db.contestRegistration.findMany({
			where: {
				contestUnique_id: contestData.unique_id,
				...(rated_only ? { type: "Rated" } : {}),
			},
		});

		const standings: { [key: string]: { [task: string]: { sets: { [set: string]: number }, last_submission: Date, penalty: number } } } = {};

		registrations.forEach((user) => {
			standings[user.userDataUnique_id] = {};
		});

		for (const submission of submissions) {
			if (!standings[submission.userDataUnique_id]) {
				continue;
			}
			const evalData = await evalSubmission(submission);
			standings[submission.userDataUnique_id][submission.taskUnique_id] ??= { sets: {}, last_submission: submission.created_at, penalty: 0 };
			evalData.set_results.forEach((set) => {
				standings[submission.userDataUnique_id][submission.taskUnique_id].sets[set.set_name] ??= 0;
				const val = standings[submission.userDataUnique_id][submission.taskUnique_id].sets[set.set_name];
				if (val < set.score) {
					standings[submission.userDataUnique_id][submission.taskUnique_id].sets[set.set_name] = set.score;
					standings[submission.userDataUnique_id][submission.taskUnique_id].last_submission = submission.created_at;
				}
			})
			if (![JudgeStatus.AC, JudgeStatus.CE, JudgeStatus.IE, JudgeStatus.WJ, JudgeStatus.WR, JudgeStatus.Judging].includes(evalData.status)) {
				standings[submission.userDataUnique_id][submission.taskUnique_id].penalty++;
			}
		}

		type Standings = { unique_id: string, data: { [task: string]: number }, score: number, last_submission: Date, rank?: number };
		const standingsUsers: Standings[] = [];

		for (const standing in standings) {

			const data = standings[standing];

			let score = 0, penalty = 0, last_submission = new Date(0);

			const taskData: { [task: string]: number } = {};

			contestData.TaskUse.forEach((task) => {

				if (!data[task.task.unique_id]) return;

				let scored = false;

				for (const set in data[task.task.unique_id].sets) {
					if (data[task.task.unique_id].sets[set] != 0) {
						scored = true;
					}
					score += data[task.task.unique_id].sets[set];
					taskData[task.task.unique_id] ??= 0;
					taskData[task.task.unique_id] += data[task.task.unique_id].sets[set];
				}

				if (scored) {

					penalty += data[task.task.unique_id].penalty;
					last_submission = new Date(Math.max(data[task.task.unique_id].last_submission.getTime(), last_submission.getTime()));

				}

			});

			standingsUsers.push({
				unique_id: standing,
				data: taskData,
				score,
				last_submission,
			});

		}

		standingsUsers.sort((a, b) => {
			if (a.score > b.score) return -1;
			if (a.score < b.score) return 1;
			if (a.last_submission < b.last_submission) return -1;
			if (a.last_submission > b.last_submission) return 1;
			return 0;
		});

		standingsUsers[0].rank = 1;

		for (let i = 0; i < standingsUsers.length - 1; i++) {

			if (standingsUsers[i].score == standingsUsers[i + 1].score && standingsUsers[i].last_submission == standingsUsers[i + 1].last_submission) {

				standingsUsers[i + 1].rank = standingsUsers[i].rank;

			} else {

				standingsUsers[i + 1].rank = i + 2;

			}

		}

		return { standings, ranking: standingsUsers as (Standings & { rank: number })[] };

	},
	["contest_standings"],
	{
		revalidate: 2,
		tags: ["contest_standings"],
	}
);
