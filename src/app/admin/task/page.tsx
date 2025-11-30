import atsuocoder_db, { getCurrentUserData as getCurrentUser, hasRole, restrictUser } from "@/lib/atsuocoder_db";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import assert from "assert";
import Link from "next/link";

export default async function AdminTaskPage() {

	await restrictUser("Admin");

	const user = await getCurrentUser();

	assert(user);

	const task = await atsuocoder_db.task.findMany({
		where: (
			!(await hasRole('SuperAdmin')) ?
				{
					TaskManagement: {
						some: {
							userDataUnique_id: user.unique_id,
						},
					},
				} : undefined
		),
	});

	return (
		<main>

			<h1>Task Management</h1>

			<h2>問題一覧</h2>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ID</TableCell>
						<TableCell>タイトル</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell colSpan={2}>
							<Link href="/admin/task/new">作成</Link>
						</TableCell>
					</TableRow>
					{
						task.map((task, i) =>
							<TableRow key={i}>
								<TableCell>{task.url_id}</TableCell>
								<TableCell><Link href={`/admin/task/edit/${task.url_id}`}>{task.title}</Link></TableCell>
							</TableRow>
						)
					}
				</TableBody>
			</Table>

		</main>
	);

}