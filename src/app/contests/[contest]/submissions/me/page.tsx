import { Searcher } from "@/components/submissions-table";
import SubmissionsPageUI from "../basic-ui";
import { getCurrentUser } from "@/lib/w_auth_db";
import { redirect } from "next/navigation";

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

	return SubmissionsPageUI({
		title: "Submissions",
		params,
		searchParams,
		where: {
			userDataUnique_id: user.unique_id,
		},
		url: `/contests/${(await params).contest}/submissions`,
	});

}