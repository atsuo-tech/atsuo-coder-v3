import { getContest } from '@/lib/atsuocoder_db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function TasksPage(
	{
		params,
	}: {
		params: Promise<{ contest: string }>,
	}
) {

	const { contest } = await params;

	const contestData = await getContest(contest);

	if (
		!contestData ||
		!contestData.is_public ||
		(
			!contestData.is_permanent &&
			contestData.start_time.getTime() > Date.now()
		)
	) {

		notFound();

	}

	const {
		TaskUse,
	} = contestData;

	return (
		<main>

			<h1>Tasks</h1>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>タイトル</th>
					</tr>
				</thead>
				<tbody>
					{
						TaskUse.map((element, i) => {
							return (
								<tr key={i}>
									<th>
										{element.assignment}
									</th>
									<td>
										<Link href={`/contests/${contest}/tasks/${element.task.url_id}`}>{element.task.title}</Link>
									</td>
								</tr>
							)
						})
					}
				</tbody>
			</table>

		</main>
	);

}