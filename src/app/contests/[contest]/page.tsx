import Markdown from '@/components/markdown';
import atsuocoder_db, { getContest, hasRole } from '@/lib/atsuocoder_db';
import { notFound, redirect } from 'next/navigation';
import styles from './page.module.css';
import { RangeMsToString, RatedRangeToString } from '@/lib/utils';
import { getCurrentUser } from '@/lib/w_auth_db';
import { Button, ButtonGroup } from '@mui/material';
import { RegisterContest } from './register';
import { ContestRegistable, ContestViewable } from '@/lib/contest';

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

	const registration = user && await atsuocoder_db.contestRegistration.findUnique({
		where: {
			contestUnique_id_userDataUnique_id: {
				contestUnique_id: contestData.unique_id,
				userDataUnique_id: user.unique_id,
			},
		},
	});

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

				{
					registration &&
					<p>
						現在 {registration.type.toString()} として登録しています。
					</p>
				}

				<ButtonGroup fullWidth>
					{
						await ContestRegistable(contestData) &&
						<Button fullWidth variant='outlined' sx={{ color: 'white', borderColor: 'white' }} onClick={async () => { "use server"; RegisterContest(contest, true); redirect(`/contests/${contest}`); }}>Rated 登録</Button>
					}
					<Button fullWidth variant='outlined' sx={{ color: 'white', borderColor: 'white' }} onClick={async () => { "use server"; RegisterContest(contest, false); redirect(`/contests/${contest}`); }}>Unrated 登録</Button>
				</ButtonGroup>

			</main>

			<main className={styles.description}>

				<Markdown md={description} />

			</main>
		</div >
	)

}