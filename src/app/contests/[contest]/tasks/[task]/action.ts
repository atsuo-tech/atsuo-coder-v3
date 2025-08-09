'use server';

import atsuocoder_db, { getContest } from "@/lib/atsuocoder_db";
import { ContestViewable } from "@/lib/contest";
import { getCurrentUser } from "@/lib/w_auth_db";
import { notFound, redirect } from "next/navigation";

export default async function TaskSubmit(formData: FormData) {

	const contest = formData.get('contest');
	const task = formData.get('task');
	const code = formData.get('code');
	const language_id = formData.get('language_id');

	if (typeof contest != 'string' || typeof task != 'string' || typeof code != 'string' || typeof language_id != 'string') {

		notFound();

	}

	const contestData = await getContest(contest);
	const userData = await getCurrentUser();

	if (!contestData || !(await ContestViewable(contestData)) || !userData) {

		notFound();

	}

	const taskData = await atsuocoder_db.task.findFirst({
		where: {
			url_id: task,
			TaskUse: {
				some: {
					contestUnique_id: contestData.unique_id,
				},
			},
		},
	});

	if (!taskData) {

		notFound();

	}

	const language = await atsuocoder_db.languageData.findUnique({
		where: {
			language_id: Number(language_id),
		},
	});

	if (!language) {

		notFound();

	}

	await atsuocoder_db.submission.create({
		data: {
			contestUnique_id: contestData.unique_id,
			taskUnique_id: taskData.unique_id,
			code,
			userDataUnique_id: userData.unique_id,
			languageDataLanguage_id: language.language_id,
		},
	});

	redirect(`/contests/${contest}/submissions/me`);

}
