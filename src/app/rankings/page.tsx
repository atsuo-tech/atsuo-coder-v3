import User from '@/components/user';
import atsuocoder_db from '@/lib/atsuocoder_db';
import w_auth_db from '@/lib/w_auth_db';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: "Rankings / AtsuoCoder",
}

export default async function RankingsPage() {

	const users = await atsuocoder_db.userData.findMany({
		orderBy: {
			rating: "desc",
		}
	});

	const authUsers = await w_auth_db.user.findMany({
		where: {
			unique_id: {
				in: users.map((user) => user.unique_id),
			},
		},
	});

	return (
		<main>

			<h1>Rankings</h1>

			<h2>レーティング（アルゴリズム）</h2>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>順位</TableCell>
						<TableCell>ユーザ名</TableCell>
						<TableCell>卒業回</TableCell>
						<TableCell>レーティング</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						users.map((user, i) => {
							const userInfo = authUsers.find((authUser) => authUser.unique_id == user.unique_id);

							if (!userInfo) {

								return (
									<TableRow key={i}>
										<TableCell colSpan={4}>Unknown User</TableCell>
									</TableRow>
								);

							}

							return (
								<TableRow key={i}>
									<TableCell>{i + 1}</TableCell>
									<TableCell><User unique_id={user.unique_id} /></TableCell>
									<TableCell>{userInfo.grade}</TableCell>
									<TableCell>{user.rating}</TableCell>
								</TableRow>
							)
						})
					}
				</TableBody>
			</Table>

		</main>
	);

}