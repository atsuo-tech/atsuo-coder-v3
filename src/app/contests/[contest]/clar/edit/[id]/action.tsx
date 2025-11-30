"use server";

import atsuocoder_db, { getContest } from "@/lib/atsuocoder_db";
import { ContestViewable } from "@/lib/contest";
import { getCurrentUser } from "@/lib/w_auth_db";
import assert from "assert";
import { notFound, redirect } from "next/navigation";
import { getClar } from "../../lib";

export default async function EditClarAction(formData: FormData) {

	const id = formData.get('id');
	const answer = formData.get('answer');
	const is_public = formData.get('is_public');

	if (typeof id != "string" || typeof answer != "string" || typeof is_public != "string") {

		notFound();

	}

	const clar = await getClar(id);

	if (!clar) {

		notFound();

	}

	const user = await getCurrentUser();
	const contestData = await getContest(clar.contest.url_id);

	if (!(await ContestViewable(contestData))) {

		notFound();

	}

	assert(contestData);
	assert(user);

	console.log(answer);

	await atsuocoder_db.clarAnswer.upsert({
		where: {
			clarUnique_id: clar.unique_id,
		},
		create: {
			answer,
			is_public: is_public == "true",
			userDataUnique_id: user.unique_id,
			clarUnique_id: clar.unique_id,
		},
		update: {
			answer,
			is_public: is_public == "true",
			userDataUnique_id: user.unique_id,
		},
	});

	redirect(`/contests/${clar.contest.url_id}/clar`);

}
