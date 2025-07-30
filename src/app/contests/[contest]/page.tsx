import Markdown from '@/components/markdown';
import { getContest } from '@/lib/atsuocoder_db';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { RangeMsToString } from '@/lib/utils';

export default async function ContestPage(
	{ params }:
		{
			params: Promise<{ contest: string }>
		}
) {

	const { contest } = await params;

	const contestData = await getContest(contest);

	if (!contestData || !contestData.is_public) {

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
						Rated対象：
						{
							rated_range[0] == -1 ?
								"なし" :
								rated_range[1] == -1 ?
									"All" :
									(
										rated_range[0] + " ~ " + (
											rated_range[1] == -1 ?
												"" :
												rated_range[1]
										)
									)
						}
					</li>
				</ul>
			</main>

			<main className={styles.description}>

				<Markdown md={description} />

			</main>
		</div>
	)

}