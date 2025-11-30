import { restrictUser } from "@/lib/atsuocoder_db";
import { Button, TextField } from "@mui/material";
import { revalidateTag } from "next/cache";

export default async function CachePage() {

	await restrictUser("SuperAdmin");

	return (
		<main>
			<h1>Cache Management</h1>
			<form
				action={
					async (formData: FormData) => {
						"use server";
						await restrictUser("SuperAdmin");
						revalidateTag(formData.get("tag") as string);
					}
				}
			>
				<TextField label="Tag" name="tag" fullWidth />
				<Button type="submit" variant="contained" fullWidth>Clear Cache</Button>
			</form>
		</main>
	)

}