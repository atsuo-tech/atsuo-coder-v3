import atsuocoder_db, { getContest, getCurrentUserData } from "@/lib/atsuocoder_db"
import { ContestManagable } from "@/lib/contest";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { notFound } from "next/navigation";
import ManagementFormControl from "./form";
import assert from "assert";
import User from "@/components/user";
import AddTaskManagement from "./action";

export default async function TaskManagement(
	{
		params,
	}: {
		params: Promise<{
			task: string,
		}>,
	}
) {

	const { task } = await params;

	const taskData = await atsuocoder_db.task.findFirst({
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

	if (!taskData) {

		notFound();

	}

	assert(taskData);

	const user = await getCurrentUserData();

	if (!user || (user.role != "SuperAdmin" && !taskData.TaskManagement.find((management) => management.user.unique_id == user.unique_id))) {

		notFound();

	}

	return (
		<main>

			<h1>問題管理者の編集</h1>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ユーザー名</TableCell>
						<TableCell>権限</TableCell>
						<TableCell>操作</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell colSpan={3}>
							<form action={AddTaskManagement}>
								<ManagementFormControl task={task} />
								<p>404が出た際は、ユーザーが存在しない可能性が高いです。</p>
							</form>
						</TableCell>
					</TableRow>
					{
						taskData.TaskManagement.map(
							(management, i) =>
								<TableRow key={i}>
									<TableCell><User unique_id={management.user.unique_id} /></TableCell>
									<TableCell>{management.role == 'Editor' ? "編集者" : "テスター"}</TableCell>
								</TableRow>
						)
					}
				</TableBody>
			</Table>

		</main >
	)

}
