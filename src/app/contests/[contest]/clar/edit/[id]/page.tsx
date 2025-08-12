import atsuocoder_db, { getContest } from "@/lib/atsuocoder_db";
import { ContestManagable } from "@/lib/contest";
import assert from "assert";
import { notFound } from "next/navigation";
import EditClarForm from "./form";
import EditClarAction from "./action";
import { getClar } from "../../lib";

export default async function CreateClarPage(
	{
		params,
	}: {
		params: Promise<{
			contest: string,
			id: string,
		}>,
	}
) {

	const { contest, id } = await params;

	const contestData = await getContest(contest);
	const clar = await getClar(id);

	if (!(await ContestManagable(contestData)) || clar?.contestUnique_id != contestData?.unique_id) {

		notFound();

	}

	assert(contestData);
	assert(clar);

	return (
		<main>

			<h1>Edit Clar</h1>

			<form
				action={EditClarAction}
			>

				<EditClarForm contestData={contestData} clar={clar} />

			</form>

		</main>
	)

}