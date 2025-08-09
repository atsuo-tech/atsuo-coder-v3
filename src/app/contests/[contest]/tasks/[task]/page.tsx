import Markdown from '@/components/markdown';
import atsuocoder_db, { getContest } from '@/lib/atsuocoder_db';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import TaskSubmit from './action';
import { ContestViewable } from '@/lib/contest';
import assert from 'assert';
import TaskSubmitForm from './form';

export default async function TaskPage(
	{
		params,
	}: {
		params: Promise<{ contest: string, task: string }>,
	}
) {

	const { contest, task } = await params;

	const contestData = await getContest(contest);

	if (!(await ContestViewable(contestData))) {

		notFound();

	}

	assert(contestData);

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
			type: true,
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
				<li>ジャッジ：<span className={styles.important}>{taskData.type}</span></li>
			</ul>
			<hr />
			<div className={styles.problem}>
				<Markdown md={taskData.problem} />
			</div>
			<hr />
			<div className={styles.submit}>
				<form action={TaskSubmit}>
					<TaskSubmitForm
						contest={contest}
						task={task}
						languageData={await atsuocoder_db.languageData.findMany()}
					/>
				</form>
			</div>
		</main>
	);

}