import atsuocoder_db, { getCurrentUserData, hasRole, restrictUser } from "@/lib/atsuocoder_db";
import { List, ListItem, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import assert from "assert";
import Link from "next/link";

export default async function AdminTestcasePage() {

	await restrictUser("Admin");

	const user = await getCurrentUserData();

	assert(user);

	const data = await atsuocoder_db.task.findMany({
		where: (
			user.role != "SuperAdmin" ?
				{
					TaskManagement: {
						some: {
							userDataUnique_id: user.unique_id,
						},
					},
				} : undefined
		),
		include: {
			TestSet: {
				select: {
					set_name: true,
					score: true,
					TestCaseUse: {
						select: {
							testcase: {
								select: {
									case_name: true,
								},
							},
						},
					},
				},
			},
		},
	});

	return (
		<main>

			<h1>Testset / Testcase Management</h1>

			<h2>問題一覧</h2>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>問題</TableCell>
						<TableCell>テストセット</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						data.map((task, i) =>
							<TableRow key={i}>
								<TableCell><Link href={`/admin/task/edit/${task.url_id}`}>{task.title}</Link></TableCell>
								<TableCell>
									<List>
										<ListItem key={i}><Link href={`/admin/testcase/create/testset/${task.url_id}`}>テストセット追加</Link></ListItem>
										<ListItem key={i}><Link href={`/admin/testcase/create/testcase/${task.url_id}`}>テストケース追加</Link></ListItem>
										{
											task.TestSet.map((testset, i) =>
												<ListItem key={i}><Link href={`/admin/testcase/edit/testset/${task.url_id}/${testset.set_name}`}>{task.url_id}/{testset.set_name}</Link></ListItem>
											)
										}
									</List>
								</TableCell>
							</TableRow>
						)
					}
				</TableBody>
			</Table>

		</main>
	);

}