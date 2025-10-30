import type { Prisma } from "@prisma/atsuocoder";
import PageControl from "@/app/contests/[contest]/submissions/page-control";
import ResultTag from "@/app/contests/[contest]/submissions/result";
import { GetContestType } from "@/lib/atsuocoder_db";
import { getSubmissions } from "@/lib/submission";
import { Box, Button, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import Link from "next/link";
import User from "./user";
import { evalSubmission, JudgeStatus } from "@/lib/submission";
import LanguageSelector from "./selector/language";
import getLanguageData from "@/lib/language";
import { redirect } from "next/navigation";
import TaskSelector from "./selector/task";

export type Searcher = {
	user?: string;
	task?: string;
	result?: string;
	language?: string;
	sort_by?: string;
};

export default async function SubmissionsTable(
	{
		pageInt,
		contestData,
		where,
		orderBy,
		url,
	}: {
		pageInt: number,
		contestData: Exclude<GetContestType, null>,
		where?: Prisma.SubmissionWhereInput,
		orderBy?: Prisma.SubmissionOrderByWithRelationInput,
		url: string,
	},
) {

	const submissions = await getSubmissions(
		pageInt,
		{ ...where, contestUnique_id: contestData.unique_id },
		orderBy,
	);

	return (
		<div>
			<PageControl page={pageInt} hasNext={submissions.length == 21} />
			<details>
				<summary>検索</summary>
				<Box
					sx={{ my: 2 }}
				>
					<form
						action={
							async (formData: FormData) => {
								"use server";
								const user = formData.get("user")?.toString();
								const task = formData.get("task")?.toString();
								const language = formData.get("language_id")?.toString();
								const sort_by = formData.get("sort_by")?.toString();
								const params = new URLSearchParams();
								if (user) params.append("user", user);
								if (task && task != "all") params.append("task", task);
								if (language && language != "all") params.append("language", language);
								if (sort_by) params.append("sort_by", sort_by);
								redirect(`${url}?${params.toString()}`);
							}
						}
					>
						<TextField label="ユーザー名" name="user" sx={{ mr: 2 }} />
						<TaskSelector contestId={contestData.url_id} />
						<LanguageSelector languageData={await getLanguageData()} search />
						<Select name="sort_by" sx={{ mx: 2, minWidth: 200 }} defaultValue="newest">
							<MenuItem value="newest">新しい順</MenuItem>
							<MenuItem value="oldest">古い順</MenuItem>
							<MenuItem value="highest_score">得点の高い順</MenuItem>
							<MenuItem value="lowest_score">得点の低い順</MenuItem>
							<MenuItem value="fastest">実行時間の短い順</MenuItem>
							<MenuItem value="least_memory">使用メモリの少ない順</MenuItem>
						</Select>
						<Button variant="contained" fullWidth type="submit">検索</Button>
					</form>
				</Box>
			</details>
			<br />
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