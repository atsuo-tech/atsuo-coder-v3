import { getContest } from "@/lib/atsuocoder_db";
import assert from "assert";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Link from "next/link";
import User from "@/components/user";
import { getContestStandings } from "@/lib/standing";

export default async function SubmissionsPage(
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

	assert(contestData);

	const { ranking, standings } = (await getContestStandings(contest))!!;

	return (
		<main>
			<h1>Standings</h1>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>順位</TableCell>
						<TableCell>ユーザー</TableCell>
						<TableCell>点数</TableCell>
						{
							contestData.TaskUse.map(
								(task, i) =>
									<TableCell key={i}><Link href={`/contests/${contest}/tasks/${task.task.url_id}`}>{task.assignment}</Link></TableCell>
							)
						}
					</TableRow>
				</TableHead>
				<TableBody>
					{
						ranking.map((value, i) => {
							const dur = new Date(value.last_submission).getTime() - new Date(contestData.start_time).getTime();

							return (<TableRow key={i}>
								<TableCell>{value.rank}</TableCell>
								<TableCell><User unique_id={value.unique_id} /></TableCell>
								<TableCell>
									{value.score}&nbsp;
									{
										new Date(value.last_submission).getTime() != 0 &&
										<>({Math.floor(dur / 60000)}:{Math.floor(dur / 1000) % 60})</>
									}
								</TableCell>
								{
									contestData.TaskUse.map((task, i) => {

										if (!standings[value.unique_id][task.task.unique_id]) {

											return (
												<TableCell key={i}>
													{value.data[task.task.unique_id] || "-"}
												</TableCell>
											)

										}

										const last_submission = new Date(standings[value.unique_id][task.task.unique_id].last_submission).getTime();
										const dur = last_submission - new Date(contestData.start_time).getTime();

										return (
											<TableCell key={i}>
												{value.data[task.task.unique_id] || "-"}&nbsp;
												{
													last_submission != 0 &&
													<>({Math.floor(dur / 60000)}:{Math.floor(dur / 1000) % 60})</>
												}
											</TableCell>
										)
									})
								}
							</TableRow>
							)
						})
					}
				</TableBody>
			</Table>
		</main>
	)

}