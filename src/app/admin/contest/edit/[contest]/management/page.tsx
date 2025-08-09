import atsuocoder_db, { getContest } from "@/lib/atsuocoder_db"
import { ContestManagable } from "@/lib/contest";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { notFound } from "next/navigation";
import ManagementFormControl from "./form";
import assert from "assert";
import User from "@/components/user";
import AddContestManagement from "./action";

export default async function ContestManagement(
	{
		params,
	}: {
		params: Promise<{
			contest: string,
		}>,
	}
) {

	const { contest } = await params;

	const contestData = await getContest(contest);

	if (!(await ContestManagable(contestData))) {

		notFound();

	}

	assert(contestData);

	return (
		<main>

			<h1>コンテスト管理者の編集</h1>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ユーザー名</TableCell>
						<TableCell>権限</TableCell>
						<TableCell>操作</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell colSpan={3}>
							<form action={AddContestManagement}>
								<ManagementFormControl contest={contest} />
								<p>404が出た際は、ユーザーが存在しない可能性が高いです。</p>
							</form>
						</TableCell>
					</TableRow>
					{
						contestData.ContestManagement.map(
							(management, i) =>
								<TableRow key={i}>
									<TableCell><User unique_id={management.user.unique_id} /></TableCell>
									<TableCell>{management.role == 'Editor' ? "編集者" : "テスター"}</TableCell>
								</TableRow>
				)
					}
			</TableBody>
		</Table>

		</main >
	)

}
