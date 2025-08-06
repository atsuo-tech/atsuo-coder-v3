import Link from 'next/link';
import ContestControlComponent from './control';
import { getContest } from '@/lib/atsuocoder_db';

export default async function ContestEditPage(
	{
		params,
	}: {
		params: Promise<{ contest: string }>
	}
) {

	const { contest } = await params;

	const contestData = await getContest(contest);

	return (
		<main>

			<h1>コンテストを編集：{contest}</h1>

			<Link href={`/admin/contest/edit/${contest}/watch`}>
				コンテストを監視（コンテスト中に使用）
			</Link>

			<form>
				<br />
				<ContestControlComponent
					contestData={contestData}
				/>
			</form>

		</main>
	)

}