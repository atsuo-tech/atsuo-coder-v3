import atsuocoder_db, { getContest } from "@/lib/atsuocoder_db";
import { ContestManagable } from "@/lib/contest";
import assert from "assert";
import { notFound } from "next/navigation";
import EditClarForm from "./form";
import EditClarAction from "./action";

export async function getClar(unique_id: string) {

	return await atsuocoder_db.clar.findUnique({
		where: {
			unique_id,
		},
		include: {
			contest: {
				select: {
					url_id: true,
				},
			},
			ClarAnswer: {
				select: {
					answer: true,
					answerer: {
						select: {
							unique_id: true,
						},
					},
					is_public: true,
				}
			}
		}
	});

}

export type ClarType = Awaited<ReturnType<typeof getClar>>;

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