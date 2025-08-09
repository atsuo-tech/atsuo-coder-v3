import { getContest } from "@/lib/atsuocoder_db";
import { ContestEnded, ContestManagable, ContestViewable } from "@/lib/contest";
import { notFound, redirect } from "next/navigation";
import assert from "assert";
import { getCurrentUser } from "@/lib/w_auth_db";
import Link from "next/link";
import SubmissionsTable from "./submissions";

export default async function SubmissionsPage(
	{
		params,
		searchParams
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

	if (!(await ContestViewable(contestData) && await ContestEnded(contestData)) && !(await ContestManagable(contestData))) {

		if (await ContestViewable(contestData)) {

			redirect(`/contests/${contest}/submissions/me`);

		}

		notFound();

	}

	assert(contestData);
	assert(userData);

	return (
		<main>
			<h1>Submissions</h1>
			<Link href={`/contests/${contest}/submissions/me`}>あなたの提出</Link>
			<SubmissionsTable contestData={contestData} pageInt={pageInt} />
		</main>
	)

}