import atsuocoder_db, { getContest } from "@/lib/atsuocoder_db";
import { ContestManagable } from "@/lib/contest";
import getTask from "@/lib/task";
import { getCurrentUser } from "@/lib/w_auth_db";
import { Button, FormControl, TextField } from "@mui/material";
import assert from "assert";
import { notFound, redirect } from "next/navigation";

export default async function EditorialEditPage(
	{
		params,
	}: {
		params: Promise<{
			contest: string,
			task: string,
			id: string,
		}>,
	}
) {

	const { contest, task, id } = await params;

	const contestData = await getContest(contest);

	if (!(await ContestManagable(contestData))) {

		notFound();

	}

	const taskData = await getTask(contest, task);

	if (!taskData) {

		notFound();

	}

	const editorial = await atsuocoder_db.editorial.findUnique({
		where: {
			taskUnique_id: taskData.taskData.unique_id,
			unique_id: id,
		},
	});

	if (!editorial) {

		notFound();

	}

	return (
		<main>

			<h1>解説を編集</h1>

			<form
				action={
					async (formData: FormData) => {

						"use server";

						if (!(await ContestManagable(contestData))) {

							notFound();

						}

						const title = formData.get("title");
						const description = formData.get("description");

						if (typeof title != "string" || typeof description != "string") {

							notFound();

						}

						const user = await getCurrentUser();

						assert(user);

						await atsuocoder_db.editorial.update({
							where: {
								unique_id: id,
								taskUnique_id: taskData.taskData.unique_id,
							},
							data: {
								title,
								description,
								taskUnique_id: taskData.taskData.unique_id,
								userDataUnique_id: user.unique_id,
							},
						});

						redirect(`/contests/${contest}/tasks/${task}/editorials/${id}`);

					}
				}
			>

				<FormControl fullWidth>

					<TextField label="Title" name="title" defaultValue={editorial.title} required />
					<TextField label="Description" name="description" defaultValue={editorial.description} rows={8} multiline required />

					<Button type="submit" variant="contained">作成</Button>

				</FormControl>

			</form>

		</main>
	)

}