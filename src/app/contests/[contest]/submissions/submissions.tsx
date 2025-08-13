import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import PageControl from "./page-control";
import Link from "next/link";
import User from "@/components/user";
import atsuocoder_db, { GetContestType } from "@/lib/atsuocoder_db";
import type { Prisma } from "@prisma/atsuocoder";
import { evalSubmission, JudgeStatus } from "@/lib/submission";
import styles from "./submissions.module.css";
import ResultTag from "./result";

export async function getSubmissions(pageInt: number, where?: Prisma.SubmissionWhereInput) {

	return await atsuocoder_db.submission.findMany({
		where,
		include: {
			language: {
				select: {
					name: true,
				},
			},
			contest: {
				select: {
					url_id: true,
					TaskUse: {
						select: {
							assignment: true,
							taskUnique_id: true,
						},
					},
				},
			},
			task: {
				select: {
					url_id: true,
					title: true,
				},
			},
		},
		orderBy: {
			created_at: 'desc',
		},
		skip: pageInt * 20,
		take: 21,
	});

}

export default async function SubmissionsTable(
	{
		pageInt,
		contestData,
		where,
	}: {
		pageInt: number,
		contestData: Exclude<GetContestType, null>,
		where?: Prisma.SubmissionWhereInput,
	},
) {

	const submissions = await getSubmissions(pageInt, { ...where, contestUnique_id: contestData.unique_id });

	return (
		<div>
			<PageControl page={pageInt} hasNext={submissions.length == 21} />
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>提出日時</TableCell>
						<TableCell>問題</TableCell>
						<TableCell>ユーザー</TableCell>
						<TableCell>言語</TableCell>
						<TableCell>得点</TableCell>
						<TableCell>コード長</TableCell>
						<TableCell>結果</TableCell>
						<TableCell>実行時間</TableCell>
						<TableCell>メモリ</TableCell>
						<TableCell></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						submissions.length == 0 ?
							<TableRow>
								<TableCell colSpan={10}>提出がありません</TableCell>
							</TableRow> :
							await Promise.all(
								submissions.slice(0, 20).map(async (submission, i) => {

									const info = await evalSubmission(submission);

									if ([JudgeStatus.CE, JudgeStatus.IE, JudgeStatus.WJ, JudgeStatus.WR].includes(info.status)) {

										return (
											<TableRow key={i}>
												<TableCell>{submission.created_at.toLocaleString("ja-jp")}</TableCell>
												<TableCell><Link href={`/contests/${submission.contest.url_id}/tasks/${submission.task.url_id}`}>{submission.contest.TaskUse.find((use) => use.taskUnique_id == submission.taskUnique_id)?.assignment} - {submission.task.title}</Link></TableCell>
												<TableCell><User unique_id={submission.userDataUnique_id} /></TableCell>
												<TableCell>{submission.language.name}</TableCell>
												<TableCell>0</TableCell>
												<TableCell>{submission.code.length} Byte</TableCell>
												<ResultTag defaultInfo={info} id={submission.unique_id} />
												<TableCell><Link href={`/contests/${contestData.url_id}/submissions/${submission.unique_id}`}>詳細</Link></TableCell>
											</TableRow>
										)

									}

									return (
										<TableRow key={i}>
											<TableCell>{submission.created_at.toLocaleString("ja-jp")}</TableCell>
											<TableCell><Link href={`/contests/${submission.contest.url_id}/tasks/${submission.task.url_id}`}>{submission.contest.TaskUse.find((use) => use.taskUnique_id == submission.taskUnique_id)?.assignment} - {submission.task.title}</Link></TableCell>
											<TableCell><User unique_id={submission.userDataUnique_id} /></TableCell>
											<TableCell>{submission.language.name}</TableCell>
											<TableCell>{info.score}</TableCell>
											<TableCell>{submission.code.length} Byte</TableCell>
											<ResultTag defaultInfo={info} id={submission.unique_id} />
											<TableCell><Link href={`/contests/${contestData.url_id}/submissions/${submission.unique_id}`}>詳細</Link></TableCell>
										</TableRow>
									);
								})
							)
					}
				</TableBody>
			</Table>
			<PageControl page={pageInt} hasNext={submissions.length == 21} />
		</div >
	)

}