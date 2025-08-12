import Markdown from '@/components/markdown';
import { getContest, hasRole } from '@/lib/atsuocoder_db';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { RangeMsToString, RatedRangeToString } from '@/lib/utils';
import { getCurrentUser } from '@/lib/w_auth_db';
import { Box, Button, ButtonGroup } from '@mui/material';

export default async function ContestPage(
	{ params }:
		{
			params: Promise<{ contest: string }>
		}
) {

	const { contest } = await params;

	const contestData = await getContest(contest);

	const user = await getCurrentUser();

	if (
		!contestData ||
		(
			!contestData.ContestManagement.find((management) => management.user.unique_id == user?.unique_id) &&
			!(await hasRole('SuperAdmin')) &&
			!contestData.is_public
		)
	) {

		notFound();

	}

	const {
		title,
		description,
		start_time,
		end_time,
		is_permanent,
		rated_range
	} = contestData;

	return (
		<div>
			<main className={styles.top}>

				<h1>{title}</h1>

				<ul>
					{
						!is_permanent ?
							<li>
								コンテスト時間：
								{start_time.toLocaleString("ja-jp", { timeZone: "Asia/Tokyo" })} ～ {end_time.toLocaleString("ja-jp", { timeZone: "Asia/Tokyo" })}
								（{RangeMsToString(end_time.getTime() - start_time.getTime())}）
							</li>
							:
							<li>
								これは常設コンテストです。
							</li>
					}
					<li>
						Rated対象：{RatedRangeToString(rated_range)}
					</li>
				</ul>

				<ButtonGroup fullWidth>
					<Button fullWidth variant='outlined' sx={{ color: 'white', borderColor: 'white' }}>Rated 登録</Button>
					<Button fullWidth variant='outlined' sx={{ color: 'white', borderColor: 'white' }}>Unrated 登録</Button>
				</ButtonGroup>

			</main>

			<main className={styles.description}>

				<Markdown md={description} />

			</main>
		</div>
	)

}