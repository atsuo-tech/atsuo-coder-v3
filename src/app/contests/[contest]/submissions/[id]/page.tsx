import atsuocoder_db, { getContest } from "@/lib/atsuocoder_db";
import type { Prisma } from "@prisma/atsuocoder";
import { ContestEnded, ContestManagable, ContestViewable } from "@/lib/contest";
import { evalSubmission, JudgeResult, JudgeStatus } from "@/lib/submission";
import { getCurrentUser } from "@/lib/w_auth_db";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import styles from "../submissions.module.css";
import ResultTag from "../result";

export default async function SubmissionPage(
	{
		params,
	}: {
		params: Promise<{
			contest: string,
			id: string,
		}>,
	}
) {

	const { contest, id } = await params;

	const contestData = await getContest(contest);

	const submission = await atsuocoder_db.submission.findUnique({
		where: {
			contest: {
				url_id: contest,
			},
			unique_id: id,
		},
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
						where: {
							task: {
								Submission: {
									some: {
										unique_id: id,
									},
								},
							},
						},
						select: {
							assignment: true,
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
	});

	const user = await getCurrentUser();

	if (!submission) {

		notFound();

	}

	if (submission.userDataUnique_id == user?.unique_id) {

		if (!(await ContestViewable(contestData))) {

			notFound();

		}

	} else {

		if (!(await ContestViewable(contestData) && await ContestEnded(contestData)) && !(await ContestManagable(contestData))) {

			notFound();

		}

	}

	const result = submission.result as unknown as JudgeResult;

	const info = await evalSubmission(submission);

	return (
		<main>

			<h1>提出 {id}</h1>

			{
				await ContestManagable(contestData) &&
				<Button
					onClick={async () => {
						"use server";
						await atsuocoder_db.submission.update({
							where: {
								unique_id: id,
							},
							data: {
								result: { status: JudgeStatus.WR } as JudgeResult as unknown as Prisma.JsonObject,
								queued: false,
							}
						});
						redirect(`/contests/${contest}/submissions/${id}`);
					}}
					fullWidth
					variant="outlined"
				>
					リジャッジ
				</Button>
			}

			<h2>コード</h2>

			<TextField rows={12} multiline value={submission.code} fullWidth />

			<h2>結果</h2>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>問題</TableCell>
						<TableCell>点数</TableCell>
						<TableCell>言語</TableCell>
						<TableCell>結果</TableCell>
						<TableCell>実行時間</TableCell>
						<TableCell>メモリ</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell><Link href={`/contests/${submission.contest.url_id}/tasks/${submission.task.url_id}`}>{submission.contest.TaskUse[0].assignment} - {submission.task.title}</Link></TableCell>
						<TableCell>{info.score}</TableCell>
						<TableCell>{submission.language.name}</TableCell>
						{
							[JudgeStatus.CE, JudgeStatus.IE, JudgeStatus.WJ, JudgeStatus.WR].includes(info.status) ?
								<TableCell colSpan={3}><span className={`${styles.result} ${styles[JudgeStatus[info.status]]}`}>{JudgeStatus[info.status]}</span></TableCell> :
								<>
									<TableCell><ResultTag info={info} /></TableCell>
									<TableCell>{Math.round(info.run_time * 1000)} ms</TableCell>
									<TableCell>{info.memory} KiB</TableCell>
								</>
						}
					</TableRow>
				</TableBody>
			</Table>

			{
				result.compile_error?.replaceAll("\n", "") &&
				<div>
					<h2>コンパイルエラー</h2>
					<TextField multiline value={result.compile_error} fullWidth />
				</div>
			}

			<h2>テストセット</h2>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>セット名</TableCell>
						<TableCell>結果</TableCell>
						<TableCell>実行時間</TableCell>
						<TableCell>メモリ</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						info.set_results.map(
							(testset, i) =>
								<TableRow key={i}>
									<TableCell>{testset.set_name}</TableCell>
									<TableCell><span className={`${styles.result} ${styles[JudgeStatus[testset.status]]}`}>{JudgeStatus[testset.status]}</span></TableCell>
									<TableCell>{Math.round(info.run_time * 1000)} ms</TableCell>
									<TableCell>{testset.memory} KiB</TableCell>
								</TableRow>
						)
					}
				</TableBody>
			</Table>

			<h2>テストケース</h2>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ケース名</TableCell>
						<TableCell>結果</TableCell>
						<TableCell>実行時間</TableCell>
						<TableCell>メモリ</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						info.case_results.map(
							(testcase, i) =>
								<TableRow key={i}>
									<TableCell>{testcase.case_name}</TableCell>
									<TableCell><span className={`${styles.result} ${styles[JudgeStatus[testcase.status]]}`}>{JudgeStatus[testcase.status]}</span></TableCell>
									<TableCell>{Math.round(info.run_time * 1000)} ms</TableCell>
									<TableCell>{testcase.memory} KiB</TableCell>
								</TableRow>
						)
					}
				</TableBody>
			</Table>

		</main>
	)

}