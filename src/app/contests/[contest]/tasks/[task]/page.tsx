import Markdown from '@/components/markdown';
import atsuocoder_db, { getContest } from '@/lib/atsuocoder_db';
import styles from './page.module.css';
import TaskSubmit from './action';
import TaskSubmitForm from './form';
import { Metadata } from 'next';
import getTask from '@/lib/task';
import { ContestEnded, ContestManagable, ContestViewable } from '@/lib/contest';
import Link from 'next/link';

export async function generateMetadata(
	{
		params
	}: {
		params: Promise<{
			contest: string,
			task: string,
		}>,
	}
): Promise<Metadata> {

	const { contest, task } = await params;

	const { use, taskData } = await getTask(contest, task);

	return {
		title: `${use.assignment} - ${taskData.title} / AtsuoCoder`,
	};

}

export default async function TaskPage(
	{
		params,
	}: {
		params: Promise<{ contest: string, task: string }>,
	}
) {

	const { contest, task } = await params;

	const contestData = await getContest(contest);
	const { use, taskData } = await getTask(contest, task);

	return (
		<main className={styles.main}>
			<h1>{use.assignment} - {taskData.title}</h1>
			{
				await ContestViewable(contestData) && (await ContestEnded(contestData) || await ContestManagable(contestData)) &&
				<Link href={`/contests/${contest}/tasks/${task}/editorials`}>解説を見る</Link>
			}
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