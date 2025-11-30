import Markdown from "@/components/markdown";
import User from "@/components/user";
import atsuocoder_db, { getContest } from "@/lib/atsuocoder_db";
import { ContestEnded, ContestManagable, ContestViewable } from "@/lib/contest";
import getTask from "@/lib/task";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditorialViewPage(
	{
		params,
	}: {
		params: Promise<{
			contest: string,
			task: string,
			id: string,
		}>,
	}
) {

	const { contest, task, id } = await params;

	const contestData = await getContest(contest);

	if (!(await ContestViewable(contestData)) || (!(await ContestEnded(contestData)) && !(await ContestManagable(contestData)))) {

		notFound();

	}

	const taskData = await getTask(contest, task);

	if (!taskData) {

		notFound();

	}

	const editorial = await atsuocoder_db.editorial.findUnique({
		where: {
			taskUnique_id: taskData.taskData.unique_id,
			unique_id: id,
		},
	});

	if (!editorial) {

		notFound();

	}

	return (
		<main>

			<h1>{editorial.title}</h1>

			<div>By <User unique_id={editorial.userDataUnique_id} /></div>

			<br />

			{
				await ContestManagable(contestData) &&
				<Link href={`/contests/${contest}/tasks/${task}/editorials/${id}/edit`}>解説を編集</Link>
			}

			<Markdown md={editorial.description} />

		</main>
	)

}