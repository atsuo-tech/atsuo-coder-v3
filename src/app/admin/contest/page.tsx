import Link from "next/link";

export default function AdminContestPage() {

	return (
		<main>

			<h1>Contest Management</h1>

			<h2>コンテスト一覧</h2>

			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>タイトル</th>
						<th>開始時刻</th>
						<th>終了時刻</th>
						<th>公開</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td colSpan={5}>
							<Link href="/admin/contest/create">作成</Link>
						</td>
					</tr>
					<tr>
						<td>awtf2025</td>
						<td>
							<Link href="/admin/contest/edit/awtf2025">
								AtsuoCoder Waseda Tour Finals 2025
							</Link>
						</td>
						<td>2025/07/31 18:13</td>
						<td>2025/08/31 18:13</td>
						<td>公開済</td>
					</tr>
				</tbody>
			</table>

		</main>
	)

}