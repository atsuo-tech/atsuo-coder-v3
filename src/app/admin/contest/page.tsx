import atsuocoder_db, { hasRole, restrictUser } from '@/lib/atsuocoder_db';
import { getCurrentUser } from '@/lib/w_auth_db';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Link from 'next/link';

export default async function AdminContestPage() {

	await restrictUser('Admin');

	const user = (await getCurrentUser())!!;

	const contests = await atsuocoder_db.contest.findMany({
		where: (
			!(await hasRole('SuperAdmin')) ?
				{
					ContestManagement: {
						some: {
							userDataUnique_id: user.unique_id,
						},
					},
				} : undefined
		),
	});

	return (
		<main>

			<h1>Contest Management</h1>

			<h2>コンテスト一覧</h2>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ID</TableCell>
						<TableCell>タイトル</TableCell>
						<TableCell>開始時刻</TableCell>
						<TableCell>終了時刻</TableCell>
						<TableCell>公開</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell colSpan={5}>
							<Link href="/admin/contest/create">作成</Link>
						</TableCell>
					</TableRow>
					{
						contests.map((contest, i) =>
							<TableRow key={i}>
								<TableCell>
									<Link href={`/admin/contest/edit/` + contest.url_id}>
										{contest.url_id}
									</Link>
								</TableCell>
								<TableCell>{contest.title}</TableCell>
								<TableCell>{contest.start_time.toLocaleString("ja-jp")}</TableCell>
								<TableCell>{contest.end_time.toLocaleString("ja-jp")}</TableCell>
								<TableCell>{contest.is_public ? "公開済" : "未公開"}</TableCell>
							</TableRow>
						)
					}
				</TableBody>
			</Table>

		</main>
	)

}