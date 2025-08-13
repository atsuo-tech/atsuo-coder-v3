import atsuocoder_db, { getContest } from "@/lib/atsuocoder_db";
import { ContestViewable } from "@/lib/contest";
import { notFound } from "next/navigation";
import assert from "assert";
import { getCurrentUser } from "@/lib/w_auth_db";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Link from "next/link";
import { evalSubmission, JudgeStatus } from "@/lib/submission";
import User from "@/components/user";

export default async function SubmissionsPage(
	{
		params,
	}: {
		params: Promise<{
			contest: string,
		}>,
	}
) {

	const { contest } = await params;

	const userData = await getCurrentUser();

	const contestData = await getContest(contest);

	if (!(await ContestViewable(contestData))) {

		notFound();

	}

	assert(contestData);
	assert(userData);

	const submissions = await atsuocoder_db.submission.findMany({
		where: {
			contestUnique_id: contestData.unique_id,
		},
		orderBy: {
			created_at: "asc",
		},
	});

	const registrations = await atsuocoder_db.contestRegistration.findMany({
		where: {
			contestUnique_id: contestData.unique_id,
		},
	});

	const standings: { [key: string]: { [task: string]: { sets: { [set: string]: number }, last_submission: Date, penalty: number } } } = {};

	registrations.forEach((user) => {
		standings[user.userDataUnique_id] = {};
	});

	for (const submission of submissions) {
		if (!standings[submission.userDataUnique_id]) {
			return;
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

	const standingsUsers: { unique_id: string, data: { [task: string]: number }, score: number, last_submission: Date }[] = [];

	for (const standing in standings) {

		const data = standings[standing];

		let score = 0, penalty = 0, last_submission = new Date(0);

		const taskData: { [task: string]: number } = {};

		contestData.TaskUse.forEach((task) => {

			if (!data[task.task.unique_id]) return;

			penalty += data[task.task.unique_id].penalty;
			last_submission = new Date(Math.max(data[task.task.unique_id].last_submission.getTime(), last_submission.getTime()));

			for (const set in data[task.task.unique_id].sets) {
				score += data[task.task.unique_id].sets[set];
				taskData[task.task.unique_id] ??= 0;
				taskData[task.task.unique_id] += data[task.task.unique_id].sets[set];
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

	return (
		<main>
			<h1>Standings</h1>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>順位</TableCell>
						<TableCell>ユーザー</TableCell>
						<TableCell>点数</TableCell>
						{
							contestData.TaskUse.map(
								(task, i) =>
									<TableCell key={i}><Link href={`/contests/${contest}/tasks/${task.task.url_id}`}>{task.assignment}</Link></TableCell>
							)
						}
					</TableRow>
				</TableHead>
				<TableBody>
					{
						standingsUsers.map((value, i) => {
							const dur = value.last_submission.getTime() - contestData.start_time.getTime();

							return (<TableRow key={i}>
								<TableCell>{i + 1}</TableCell>
								<TableCell><User unique_id={value.unique_id} /></TableCell>
								<TableCell>
									{value.score}&nbsp;
									{
										value.last_submission.getTime() != 0 &&
										<>({Math.floor(dur / 60000)}:{Math.floor(dur / 1000) % 60})</>
									}
								</TableCell>
								{
									contestData.TaskUse.map((task, i) => {
										const last_submission = standings[value.unique_id][task.task.unique_id].last_submission.getTime();
										const dur = last_submission - contestData.start_time.getTime();

										return (
											<TableCell key={i}>
												{value.data[task.task.unique_id] || "-"}&nbsp;
												{
													last_submission != 0 &&
													<>({Math.floor(dur / 60000)}:{Math.floor(dur / 1000) % 60})</>
												}
											</TableCell>
										)
									})
								}
							</TableRow>
							)
						})
					}
				</TableBody>
			</Table>
		</main>
	)

}