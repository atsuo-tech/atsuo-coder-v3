'use server';

import atsuocoder_db, { getContest } from "@/lib/atsuocoder_db";
import { ContestManagable } from "@/lib/contest";
import w_auth_db from "@/lib/w_auth_db";
import assert from "assert";
import { notFound, redirect } from "next/navigation";

export default async function AddContestManagement(formData: FormData) {

	const contest = formData.get('contest');
	const username = formData.get('username');
	const role = formData.get('role');

	if (typeof contest != 'string' || typeof username != 'string' || typeof role != 'string' || !['editor', 'tester'].includes(role)) {

		notFound();

	}

	const contestData = await getContest(contest);

	if (!(await ContestManagable(contestData))) {

		notFound();

	}

	assert(contestData);

	const user = await w_auth_db.user.findUnique({
		where: {
			username,
		},
	});

	if(!user) {

		notFound();

	}

	await atsuocoder_db.contestManagement.create({
		data: {
			contestUnique_id: contestData.unique_id,
			userDataUnique_id: user.unique_id,
			role: role == 'editor' ? 'Editor' : 'Tester',
		},
	});

	redirect(`/admin/contest/edit/${contest}/management`);

}