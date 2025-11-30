import atsuocoder_db, { getContest } from "@/lib/atsuocoder_db";
import { ContestEnded, ContestManagable, ContestViewable } from "@/lib/contest";
import getTask from "@/lib/task";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditorialPage(
	{
		params,
	}: {
		params: Promise<{
			contest: string,
			task: string,
		}>,
	}
) {

	const { contest, task } = await params;

	const contestData = await getContest(contest);

	if (!(await ContestViewable(contestData)) || (!(await ContestEnded(contestData)) && !(await ContestManagable(contestData)))) {

		notFound();

	}

	const taskData = await getTask(contest, task);

	if (!taskData) {

		notFound();

	}

	const editorials = await atsuocoder_db.editorial.findMany({
		where: {
			taskUnique_id: taskData.taskData.unique_id,
		},
	});

	return (
		<main>

			<h1>{taskData.use.assignment} - {taskData.taskData.title} 解説</h1>

			{
				await ContestManagable(contestData) &&
				<Link href={`/contests/${contest}/tasks/${task}/editorials/add`}>解説を追加</Link>
			}

			{
				editorials.length == 0 ?
					<p>解説がありません。</p> :
					<ul>
						{
							editorials.map((editorial) =>
								<li><Link href={`/contests/${contest}/tasks/${task}/editorials/${editorial.unique_id}`}>{editorial.title}</Link></li>
							)
						}
					</ul>
			}

		</main>
	)

}