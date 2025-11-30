import atsuocoder_db, { getCurrentUserData, restrictUser } from "@/lib/atsuocoder_db";
import { Button, FormControl, List, ListItem, TextField } from "@mui/material";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TestsetEditPage(
	{
		params,
	}: {
		params: Promise<{
			task: string,
			testset: string,
		}>,
	},
) {

	const { task, testset } = await params;

	const taskData = await atsuocoder_db.task.findUnique({
		where: {
			url_id: task,
		},
		include: {
			TaskManagement: {
				select: {
					role: true,
					userDataUnique_id: true,
				},
			},
		},
	});

	const user = await getCurrentUserData();

	if (!taskData || !user || (user.role != "SuperAdmin" && !taskData.TaskManagement.find((management) => management.userDataUnique_id == user.unique_id))) {

		notFound();

	}

	const testsetData = await atsuocoder_db.testSet.findUnique({
		where: {
			taskUnique_id_set_name: {
				taskUnique_id: taskData.unique_id,
				set_name: testset,
			},
		},
		include: {
			TestCaseUse: {
				select: {
					testcase: {
						select: {
							case_name: true,
						},
					},
				},
			},
		},
	});

	if (!testsetData) {

		notFound();

	}

	return (
		<main>

			<h1>テストセット編集：{task}/{testset}</h1>

			<h2>データ</h2>

			<form>
				<FormControl fullWidth>
					<input type="hidden" value={testsetData.unique_id} />
					<TextField name="score" label="Max score" type="number" />
					<TextField name="index" label="Set order" type="number" />
					<TextField name="set_name" label="Set name" type="number" />
					<Button type="submit" variant="contained">変更</Button>
				</FormControl>
			</form>

			<h2>ケース</h2>

			<form>
				<FormControl fullWidth>
					<input type="hidden" value={testsetData.unique_id} />
					<TextField name="case_name" label="Case name" type="number" />
					<Button type="submit" variant="contained">追加</Button>
				</FormControl>
			</form>

			<h3>既存のケース</h3>

			<List>
				{
					testsetData.TestCaseUse.map((caseUse, i) =>
						<ListItem key={i}><Link href={`/admin/testcase/edit/testcase/${task}/${caseUse.testcase.case_name}`}>{task}/{caseUse.testcase.case_name}</Link></ListItem>
					)
				}
			</List>

		</main>
	)

}