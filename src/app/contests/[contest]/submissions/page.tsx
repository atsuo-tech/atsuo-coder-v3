import type { Searcher } from "@/components/submissions-table";
import SubmissionsPageUI from "./basic-ui";
import { ContestEnded, ContestManagable, ContestViewable } from "@/lib/contest";
import { getContest } from "@/lib/atsuocoder_db";
import { redirect, notFound } from "next/navigation";

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
		} & Searcher>,
	}
) {

	const { contest } = await params;

	const contestData = await getContest(contest);

	if (!(await ContestViewable(contestData) && await ContestEnded(contestData)) && !(await ContestManagable(contestData))) {

		if (await ContestViewable(contestData)) {

			redirect(`/contests/${contest}/submissions/me`);

		}

		notFound();

	}

	return SubmissionsPageUI({
		title: "Submissions",
		params,
		searchParams,
		where: {},
		url: `/contests/${(await params).contest}/submissions`,
	});

}