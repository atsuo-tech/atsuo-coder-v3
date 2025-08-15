import atsuocoder_db, { getCurrentUserData } from "@/lib/atsuocoder_db";
import { Button, Input, TextField } from "@mui/material";
import { notFound } from "next/navigation";

export default async function TestcaseEditPage(
	{
		params,
	}: {
		params: Promise<{
			task: string,
			testcase: string,
		}>,
	},
) {

	const { task, testcase } = await params;

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

	const testcaseData = await atsuocoder_db.testCase.findUnique({
		where: {
			taskUnique_id_case_name: {
				taskUnique_id: taskData.unique_id,
				case_name: testcase,
			},
		},
	});

	if (!testcaseData) {

		notFound();

	}

	return (
		<main>

			<h1>テストケース編集：{task}/{testcase}</h1>

			<h2>Batch</h2>

			<form>
				<label>Stdin</label>
				<br />
				<input type="file" name="stdin" />
				<br />
				<label>Stdout</label>
				<br />
				<input type="file" name="stdout" />
				<br />
				<Button type="submit" variant="contained" sx={{ my: 1 }}>
					タイプを Batch にしたうえでアップロード
				</Button>
			</form>

			<h2>OutputOnly / Communication</h2>

			<form>
				<label>Evaluator</label>
				<br />
				<input type="file" name="stdout" />
				<br />
				<Button type="submit" variant="contained" sx={{ my: 1 }}>
					タイプを OutputOnly にしたうえでアップロード
				</Button>
				<br />
				<Button type="submit" variant="contained" sx={{ my: 1 }}>
					タイプを Communication にしたうえでアップロード
				</Button>
			</form>

		</main>
	)

}