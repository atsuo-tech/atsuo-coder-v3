import atsuocoder_db from '@/lib/atsuocoder_db';
import { RangeMsToString, RatedRangeToString } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: "Contests / AtsuoCoder",
};

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
	const recent = contests.filter((contest) => !contest.is_permanent && contest.end_time.getTime() <= Date.now()).reverse();

	return (
		<main>

			<h1>All Contests</h1>

			{
				running.length != 0 &&
				<div>

					<h2>実行中のコンテスト</h2>

					<Table>

						<TableHead>
							<TableRow>
								<TableCell>開始時刻</TableCell>
								<TableCell>コンテスト名</TableCell>
								<TableCell>時間</TableCell>
								<TableCell>Rated 対象</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{
								running.map((contest, i) =>
									<TableRow key={i}>
										<TableCell>{contest.start_time.toLocaleString("ja-jp")}</TableCell>
										<TableCell>
											<Link href={`/contests/${contest.url_id}`}>
												{contest.title}
											</Link>
										</TableCell>
										<TableCell>{RangeMsToString(contest.end_time.getTime() - contest.start_time.getTime())}</TableCell>
										<TableCell>{RatedRangeToString(contest.rated_range)}</TableCell>
									</TableRow>
								)
							}
						</TableBody>

					</Table>

				</div>
			}

			<h2>常設されたコンテスト</h2>

			<Table>

				<TableHead>
					<TableRow>
						<TableCell>コンテスト名</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{
						permanent.length == 0 &&
						<TableRow>
							<TableCell>常設されたコンテストはありません</TableCell>
						</TableRow>
					}
					{
						permanent.map((contest, i) =>
							<TableRow key={i}>
								<TableCell>
									<Link href={`/contests/${contest.url_id}`}>
										{contest.title}
									</Link>
								</TableCell>
							</TableRow>
						)
					}
				</TableBody>

			</Table>

			<h2>予定されたコンテスト</h2>

			<Table>

				<TableHead>
					<TableRow>
						<TableCell>開始時刻</TableCell>
						<TableCell>コンテスト名</TableCell>
						<TableCell>時間</TableCell>
						<TableCell>Rated 対象</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{
						upcoming.length == 0 &&
						<TableRow>
							<TableCell colSpan={4}>予定されたコンテストはありません</TableCell>
						</TableRow>
					}
					{
						upcoming.map((contest, i) =>
							<TableRow key={i}>
								<TableCell>{contest.start_time.toLocaleString("ja-jp")}</TableCell>
								<TableCell>
									<Link href={`/contests/${contest.url_id}`}>
										{contest.title}
									</Link>
								</TableCell>
								<TableCell>{RangeMsToString(contest.end_time.getTime() - contest.start_time.getTime())}</TableCell>
								<TableCell>{RatedRangeToString(contest.rated_range)}</TableCell>
							</TableRow>
						)
					}
				</TableBody>

			</Table>

			<h2>終了後のコンテスト</h2>

			<Table>

				<TableHead>
					<TableRow>
						<TableCell>開始時刻</TableCell>
						<TableCell>コンテスト名</TableCell>
						<TableCell>時間</TableCell>
						<TableCell>Rated 対象</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{
						recent.length == 0 &&
						<TableRow>
							<TableCell colSpan={4}>予定されたコンテストはありません</TableCell>
						</TableRow>
					}
					{
						recent.map((contest, i) =>
							<TableRow key={i}>
								<TableCell>{contest.start_time.toLocaleString("ja-jp")}</TableCell>
								<TableCell>
									<Link href={`/contests/${contest.url_id}`}>
										{contest.title}
									</Link>
								</TableCell>
								<TableCell>{RangeMsToString(contest.end_time.getTime() - contest.start_time.getTime())}</TableCell>
								<TableCell>{RatedRangeToString(contest.rated_range)}</TableCell>
							</TableRow>
						)
					}
				</TableBody>

			</Table>

		</main>
	);

}