import { getContest } from '@/lib/atsuocoder_db';
import { ContestViewable } from '@/lib/contest';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import assert from 'assert';
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

	if (!(await ContestViewable(contestData))) {

		notFound();

	}

	assert(contestData);

	const {
		TaskUse,
	} = contestData;

	return (
		<main>

			<h1>Tasks</h1>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>タイトル</TableCell>
						<TableCell>実行時間制限</TableCell>
						<TableCell>メモリ制限</TableCell>
						<TableCell>配点</TableCell>
						<TableCell>ジャッジ</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						TaskUse.map((element, i) => {
							return (
								<TableRow key={i}>
									<TableCell>
										<Link href={`/contests/${contest}/tasks/${element.task.url_id}`}>{element.assignment} - {element.task.title}</Link>
									</TableCell>
									<TableCell>{element.task.time_limit} ms</TableCell>
									<TableCell>{element.task.memory_limit} Bytes</TableCell>
									<TableCell>{element.task.score}</TableCell>
									<TableCell>{element.task.type}</TableCell>
								</TableRow>
							)
						})
					}
				</TableBody>
			</Table>

		</main>
	);

}