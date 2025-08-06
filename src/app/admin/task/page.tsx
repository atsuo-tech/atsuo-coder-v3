import Link from "next/link";

export default function AdminTaskPage() {

	return (
		<main>

			<h1>Task Management</h1>

			<h2>問題一覧</h2>

			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>タイトル</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td colSpan={2}>
							<Link href="/admin/task/new">作成</Link>
						</td>
					</tr>
					<tr>
						<td>awtf2025_a</td>
						<td>
							<Link href="/admin/task/edit/awtf2025_a">
								Console.log
							</Link>
						</td>
					</tr>
				</tbody>
			</table>

		</main>
	);

}