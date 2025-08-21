"use server";

import atsuocoder_db, { getContest, getCurrentUserData } from "@/lib/atsuocoder_db";
import { ContestRegistable, ContestViewable } from "@/lib/contest";
import assert from "assert";
import { notFound, redirect } from "next/navigation";

export async function RegisterContest(contest: string, is_rated: boolean) {

	const contestData = await getContest(contest);

	if (!(await ContestRegistable(contestData))) {

		notFound();

	}

	const userData = await getCurrentUserData();

	assert(contestData);
	assert(userData);

	await atsuocoder_db.contestRegistration.upsert({
		where: {
			contestUnique_id_userDataUnique_id: {
				contestUnique_id: contestData.unique_id,
				userDataUnique_id: userData.unique_id,
			},
		},
		create: {
			contestUnique_id: contestData.unique_id,
			userDataUnique_id: userData.unique_id,
			type: is_rated ? "Rated" : "Unrated",
		},
		update: {
			type: is_rated ? "Rated" : "Unrated",
		},
	});

}
