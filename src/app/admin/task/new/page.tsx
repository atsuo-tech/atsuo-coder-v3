import { restrictUser } from "@/lib/atsuocoder_db";
import { TextField } from "@mui/material";
import NewTaskForm from "./form";

export default async function NewTaskPage() {

	await restrictUser("Admin");

	return (
		<main>

			<h1>Add Task</h1>

			<form action={NewTaskForm}>

				<TextField label="Task ID" name="url_id" />

			</form>

		</main>
	)

}