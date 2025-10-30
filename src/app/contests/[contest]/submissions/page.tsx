import type { Searcher } from "@/components/submissions-table";
import SubmissionsPageUI from "./basic-ui";

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

	return SubmissionsPageUI({
		title: "Submissions",
		params,
		searchParams,
		where: {},
		url: `/contests/${(await params).contest}/submissions`,
	});

}