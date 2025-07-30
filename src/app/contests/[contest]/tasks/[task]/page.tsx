import Markdown from '@/components/markdown';
import atsuocoder_db, { getContest } from '@/lib/atsuocoder_db';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

export default async function TaskPage(
	{
		params,
	}: {
		params: Promise<{ contest: string, task: string }>,
	}
) {

	const { contest, task } = await params;

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

	const use = TaskUse.find((use) => use.task.url_id == task);

	if (!use) {

		notFound();

	}

	const taskData = await atsuocoder_db.task.findFirst({
		where: {
			url_id: task
		},
		select: {
			title: true,
			problem: true,
			time_limit: true,
			memory_limit: true,
			score: true,
			TaskManagement: {
				select: {
					user: {
						select: {
							unique_id: true,
						},
					},
					role: true,
				},
			},
		},
	});

	if (!taskData) {

		notFound();

	}

	return (
		<main className={styles.main}>
			<h1>{use.assignment} - {taskData.title}</h1>
			<hr />
			<ul>
				<li>実行時間制限：<span className={styles.important}>{taskData.time_limit}</span> ms</li>
				<li>メモリ制限：<span className={styles.important}>{taskData.memory_limit}</span> Bytes</li>
				<li>配点：<span className={styles.important}>{taskData.score}</span> 点</li>
			</ul>
			<hr />
			<div className={styles.problem}>
				<Markdown md={taskData.problem} />
			</div>
			<hr />
			<div className={styles.submit}>
				<textarea rows={25} cols={100} />
			</div>
		</main>
	);

}