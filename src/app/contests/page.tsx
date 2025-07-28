export default function ContestsPage() {

	return (
		<main>

			<h1>All Contests</h1>

			<h2>常設されたコンテスト</h2>

			<table>

				<thead>
					<tr>
						<th>コンテスト名</th>
					</tr>
				</thead>

				<tbody>
					<tr>
						<td>常設されたコンテストはありません</td>
					</tr>
				</tbody>

			</table>

			<h2>予定されたコンテスト</h2>

			<table>

				<thead>
					<tr>
						<th>開始時刻</th>
						<th>コンテスト名</th>
						<th>時間</th>
						<th>Rated 対象</th>
					</tr>
				</thead>

				<tbody>
					<tr>
						<td colSpan={4}>予定されたコンテストはありません</td>
					</tr>
				</tbody>

			</table>

			<h2>終了後のコンテスト</h2>

			<table>

				<thead>
					<tr>
						<th>開始時刻</th>
						<th>コンテスト名</th>
						<th>時間</th>
						<th>Rated 対象</th>
					</tr>
				</thead>

				<tbody>
					<tr>
						<td colSpan={4}>予定されたコンテストはありません</td>
					</tr>
				</tbody>

			</table>

		</main>
	);

}