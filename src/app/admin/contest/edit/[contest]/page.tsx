import Link from 'next/link';
import ContestControlComponent from './control';
import { getContest, restrictUser } from '@/lib/atsuocoder_db';
import ContestEditAction from './action';
import { ContestManagable } from '@/lib/contest';
import { notFound } from 'next/navigation';

export default async function ContestEditPage(
	{
		params,
	}: {
		params: Promise<{ contest: string }>
	}
) {

	const { contest } = await params;

	const contestData = await getContest(contest);

	if (!(await ContestManagable(contestData))) {

		notFound();

	}

	return (
		<main>

			<h1>コンテストを編集：{contest}</h1>

			<Link href={`/admin/contest/edit/${contest}/watch`}>
				コンテストを監視（コンテスト中に使用）
			</Link>

			<br />

			<Link href={`/admin/contest/edit/${contest}/management`}>
				コンテスト関係者の変更
			</Link>

			<form
				action={ContestEditAction}
			>
				<ContestControlComponent
					contestData={contestData}
				/>
			</form>

		</main>
	)

}