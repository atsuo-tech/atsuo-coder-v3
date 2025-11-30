import { Searcher } from "@/components/submissions-table";
import SubmissionsPageUI from "../basic-ui";
import { getCurrentUser } from "@/lib/w_auth_db";
import { notFound, redirect } from "next/navigation";
import { getContest } from "@/lib/atsuocoder_db";
import { ContestEnded, ContestManagable, ContestSubmitable, ContestViewable } from "@/lib/contest";

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

	const user = await getCurrentUser();

	if (!user) {

		redirect(`/contests/${(await params).contest}/submissions`);

	}

	const { contest } = await params;

	const contestData = await getContest(contest);

	if (!await ContestSubmitable(contestData) && !(await ContestManagable(contestData))) {

		notFound();

	}

	return SubmissionsPageUI({
		title: "Submissions",
		params,
		searchParams,
		where: {
			userDataUnique_id: user.unique_id,
		},
		url: `/contests/${(await params).contest}/submissions/me`,
	});

}