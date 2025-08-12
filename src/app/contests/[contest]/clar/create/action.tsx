"use server";

import atsuocoder_db, { getContest } from "@/lib/atsuocoder_db";
import { ContestViewable } from "@/lib/contest";
import { getCurrentUser } from "@/lib/w_auth_db";
import assert from "assert";
import { notFound, redirect } from "next/navigation";

export default async function CreateClarAction(formData: FormData) {

	const target = formData.get('target');
	const contest = formData.get('contest');
	const question = formData.get('question');
	const is_publishable = formData.get('is_publishable');

	if (typeof target != "string" || typeof contest != "string" || typeof question != "string") {

		notFound();

	}

	const user = await getCurrentUser();
	const contestData = await getContest(contest);

	if (!(await ContestViewable(contestData))) {

		notFound();

	}

	assert(contestData);
	assert(user);

	const target_task = (
		target == 'contest' ?
			undefined :
			(
				await atsuocoder_db.task.findFirst({
					where: {
						url_id: target.replace(/^task_/, ""),
					},
				})
			)?.unique_id
	);

	await atsuocoder_db.clar.create({
		data: {
			contestUnique_id: contestData.unique_id,
			taskUnique_id: target_task,
			question,
			is_publishable: (is_publishable == "true"),
			questionerUnique_id: user.unique_id,
		}
	});

	redirect(`/contests/${contest}/clar`);

}
