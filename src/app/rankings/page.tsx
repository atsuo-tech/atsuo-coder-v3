import User from '@/components/user';

export default function RankingsPage() {

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
						<th>最高値</th>
						<th>参加回数</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td><User id="okkuu" /></td>
						<td>126</td>
						<td>4229</td>
						<td>4229</td>
						<td>-1</td>
					</tr>
				</tbody>
			</table>

		</main>
	);

}