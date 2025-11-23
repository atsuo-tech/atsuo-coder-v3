import { getContest } from "@/lib/atsuocoder_db";
import { ContestViewable } from "@/lib/contest";
import assert from "assert";
import { notFound } from "next/navigation";
import CreateClarForm from "./form";
import CreateClarAction from "./action";

export default async function CreateClarPage(
	{
		params,
	}: {
		params: Promise<{
			contest: string,
		}>,
	}
) {

	const { contest } = await params;

	const contestData = await getContest(contest);

	if (!(await ContestSubmitable(contestData))) {

		notFound();

	}

	assert(contestData);

	return (
		<main>

			<h1>Create Clar</h1>

			<form
				action={CreateClarAction}
			>

				<CreateClarForm contestData={contestData} />

			</form>

		</main>
	)

}