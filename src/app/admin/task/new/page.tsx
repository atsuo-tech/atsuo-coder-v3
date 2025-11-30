import { restrictUser } from "@/lib/atsuocoder_db";
import { Button, FormControl, TextField } from "@mui/material";
import NewTaskForm from "./form";

export default async function NewTaskPage() {

	await restrictUser("Admin");

	return (
		<main>

			<h1>Add Task</h1>

			<form action={NewTaskForm}>

				<FormControl fullWidth>

					<TextField label="Task ID" name="url_id" />
					<Button type="submit">送信</Button>

				</FormControl>

			</form>

		</main>
	)

}