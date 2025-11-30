import { notFound } from "next/navigation";
import atsuocoder_db, { getContest } from "./atsuocoder_db";
import { ContestViewable } from "./contest";
import assert from "assert";
import { cache } from "react";

const getTask = cache(
	async (contest: string, task: string) => {

		const contestData = await getContest(contest);

		if (!(await ContestViewable(contestData))) {

			notFound();

		}

		assert(contestData);

		const {
			TaskUse,
		} = contestData;

		const use = TaskUse.find((use) => use.task.url_id == task);

		if (!use) {

			notFound();

		}

		const taskData = await atsuocoder_db.task.findFirst({
			where: {
				url_id: task
			},
			select: {
				unique_id: true,
				title: true,
				problem: true,
				time_limit: true,
				memory_limit: true,
				score: true,
				type: true,
				TaskManagement: {
					select: {
						user: {
							select: {
								unique_id: true,
							},
						},
						role: true,
					},
				},
			},
		});

		if (!taskData) {

			notFound();

		}

		return { use, taskData };

	}
);

export default getTask;
