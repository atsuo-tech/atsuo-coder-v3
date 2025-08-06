import User from '@/components/user';
import atsuocoder_db from '@/lib/atsuocoder_db';
import w_auth_db from '@/lib/w_auth_db';
import Link from 'next/link';

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

			<table>
				<thead>
					<tr>
						<th>順位</th>
						<th>ユーザ名</th>
						<th>卒業回</th>
						<th>レーティング</th>
					</tr>
				</thead>
				<tbody>
					{
						users.map((user, i) => {
							const userInfo = authUsers.find((authUser) => authUser.unique_id == user.unique_id);

							if(!userInfo) {

								return (
									<tr key={i}>
										<td colSpan={4}>Unknown User</td>
									</tr>
								);

							}

							return (
								<tr key={i}>
									<td>{i + 1}</td>
									<td><User unique_id={user.unique_id} /></td>
									<td>{userInfo.grade}</td>
									<td>{user.rating}</td>
								</tr>
							)
						})
					}
				</tbody>
			</table>

		</main>
	);

}