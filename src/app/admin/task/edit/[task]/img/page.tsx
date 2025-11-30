import atsuocoder_db, { getCurrentUserData } from "@/lib/atsuocoder_db";
import { Button, FormControl, List, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { notFound } from "next/navigation";

export default async function TaskImgControlPage(
	{
		params,
	}: {
		params: Promise<{
			task: string,
		}>,
	},
) {

	const { task } = await params;

	const taskData = await atsuocoder_db.task.findUnique({
		where: {
			url_id: task,
		},
		include: {
			TaskManagement: {
				select: {
					user: {
						select: {
							unique_id: true,
						},
					},
					role: true,
				},
			},
		},
	});

	if (!taskData) {

		notFound();

	}

	const user = await getCurrentUserData();

	if (!taskData || !user || (user.role != "SuperAdmin" && !taskData.TaskManagement.find((management) => management.user.unique_id == user.unique_id))) {

		notFound();

	}

	const imgs = await atsuocoder_db.img.findMany({
		where: {
			taskUnique_id: taskData.unique_id,
		},
	});

	return (
		<main>
			<h1>Task Images</h1>
			<h2>Upload</h2>
			<form>
				<FormControl fullWidth>
					<TextField name="url_id" label="File Name" />
					<input type="file" name="file" />
					<br />
					<Button type="submit" variant="contained">Upload</Button>
				</FormControl>
			</form>
			<h2>List</h2>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ファイル名</TableCell>
						<TableCell>操作</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						imgs.map((img, i) =>
							<TableRow key={i}>
								<TableCell>{img.url_id}</TableCell>
								<TableCell>
									<form>
										<input name="unique_id" type="hidden" value={img.unique_id} />
										<input type="file" name="file" />
										<Button type="submit">Upload</Button>
									</form>
									<Button>Delete</Button>
								</TableCell>
							</TableRow>
						)
					}
				</TableBody>
			</Table>
		</main>
	)

}