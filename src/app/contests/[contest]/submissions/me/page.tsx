'use server';

import { getContest } from "@/lib/atsuocoder_db";
import { ContestViewable } from "@/lib/contest";
import { notFound } from "next/navigation";
import assert from "assert";
import { getCurrentUser } from "@/lib/w_auth_db";
import Link from "next/link";
import SubmissionsTable from "../submissions";

export default async function SubmissionsPage(
	{
		params,
		searchParams,
	}: {
		params: Promise<{
			contest: string,
		}>,
		searchParams: Promise<{
			page: string
		}>,
	}
) {

	const { contest } = await params;
	const { page } = await searchParams;

	let pageInt = parseInt(page);

	if (isNaN(pageInt)) {

		pageInt = 0;

	}

	const userData = await getCurrentUser();

	const contestData = await getContest(contest);

	if (!(await ContestViewable(contestData))) {

		notFound();

	}

	assert(contestData);
	assert(userData);

	return (
		<main>
			<h1>Your Submissions</h1>
			<Link href={`/contests/${contest}/submissions`}>すべての提出</Link>
			<SubmissionsTable contestData={contestData} pageInt={pageInt} where={{ userDataUnique_id: userData.unique_id }} />
		</main>
	)

}