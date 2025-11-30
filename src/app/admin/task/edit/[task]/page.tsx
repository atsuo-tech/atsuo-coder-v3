import Link from 'next/link';
import TaskControlComponent from './control';
import atsuocoder_db, { getContest, getCurrentUserData, restrictUser } from '@/lib/atsuocoder_db';
import TaskEditAction from './action';
import { notFound } from 'next/navigation';

export default async function TaskEditPage(
	{
		params,
	}: {
		params: Promise<{ task: string }>
	}
) {

	const { task } = await params;

	const taskData = await atsuocoder_db.task.findUnique({
		where: {
			url_id: task,
		},
		include: {
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

	const user = await getCurrentUserData();

	if (!taskData || !user || (user.role != "SuperAdmin" && !taskData.TaskManagement.find((management) => management.user.unique_id == user.unique_id))) {

		notFound();

	}

	return (
		<main>

			<h1>問題を編集：{task}</h1>

			<Link href={`/admin/task/edit/${task}/management`}>
				問題関係者の変更
			</Link>

			<br />

			<Link href={`/admin/task/edit/${task}/img`}>
				静的ファイルのアップロード
			</Link>

			<form
				action={TaskEditAction}
			>
				<TaskControlComponent
					taskData={taskData}
				/>
			</form>

		</main>
	)

}