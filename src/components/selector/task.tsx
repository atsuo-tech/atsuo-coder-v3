import { getContest } from "@/lib/atsuocoder_db";
import { Divider, MenuItem, Select } from "@mui/material";

export default async function TaskSelector(
	{
		contestId,
	}: {
		contestId: string,
	}
) {

	const taskData = await getContest(contestId).then((contest) => contest?.TaskUse);

	return (
		<Select
			name="task"
			defaultValue="all"
			sx={{ mr: 2, minWidth: 200 }}
		>
			<MenuItem value="all">
				すべての問題
			</MenuItem>
			<Divider />
			{
				taskData?.map((task) => (
					<MenuItem
						key={task.task.url_id}
						value={task.task.url_id}
					>
						{task.assignment} - {task.task.title}
					</MenuItem>
				))
			}
		</Select>
	);

}