import atsuocoder_db from '@/lib/atsuocoder_db';
import { RangeMsToString, RatedRangeToString } from '@/lib/utils';
import Link from 'next/link';

export default async function ContestsPage() {

	const contests = await atsuocoder_db.contest.findMany({
		where: {
			is_public: true,
		},
		orderBy: {
			start_time: "asc",
		},
	});

	const permanent = contests.filter((contest) => contest.is_permanent);
	const upcoming = contests.filter((contest) => !contest.is_permanent && Date.now() <= contest.start_time.getTime());
	const running = contests.filter((contest) => !contest.is_permanent && contest.start_time.getTime() <= Date.now() && Date.now() <= contest.end_time.getTime());
	const recent = contests.filter((contest) => !contest.is_permanent && contest.end_time.getTime() <= Date.now());

	return (
		<main>

			<h1>All Contests</h1>

			{
				running.length != 0 &&
				<div>

					<h2>実行中のコンテスト</h2>

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
							{
								running.map((contest, i) =>
									<tr key={i}>
										<td>{contest.start_time.toLocaleString("ja-jp")}</td>
										<td>
											<Link href={`/contests/${contest.url_id}`}>
												{contest.title}
											</Link>
										</td>
										<td>{RangeMsToString(contest.end_time.getTime() - contest.start_time.getTime())}</td>
										<td>{RatedRangeToString(contest.rated_range)}</td>
									</tr>
								)
							}
						</tbody>

					</table>

				</div>
			}

			<h2>常設されたコンテスト</h2>

			<table>

				<thead>
					<tr>
						<th>コンテスト名</th>
					</tr>
				</thead>

				<tbody>
					{
						permanent.length == 0 &&
						<tr>
							<td>常設されたコンテストはありません</td>
						</tr>
					}
					{
						permanent.map((contest, i) =>
							<tr key={i}>
								<td>
									<Link href={`/contests/${contest.url_id}`}>
										{contest.title}
									</Link>
								</td>
							</tr>
						)
					}
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
					{
						upcoming.length == 0 &&
						<tr>
							<td colSpan={4}>予定されたコンテストはありません</td>
						</tr>
					}
					{
						upcoming.map((contest, i) =>
							<tr key={i}>
								<td>{contest.start_time.toLocaleString("ja-jp")}</td>
								<td>
									<Link href={`/contests/${contest.url_id}`}>
										{contest.title}
									</Link>
								</td>
								<td>{RangeMsToString(contest.end_time.getTime() - contest.start_time.getTime())}</td>
							</tr>
						)
					}
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
					{
						recent.length == 0 &&
						<tr>
							<td colSpan={4}>予定されたコンテストはありません</td>
						</tr>
					}
					{
						recent.map((contest, i) =>
							<tr key={i}>
								<td>{contest.start_time.toLocaleString("ja-jp")}</td>
								<td>
									<Link href={`/contests/${contest.url_id}`}>
										{contest.title}
									</Link>
								</td>
								<td>{RangeMsToString(contest.end_time.getTime() - contest.start_time.getTime())}</td>
							</tr>
						)
					}
				</tbody>

			</table>

		</main>
	);

}