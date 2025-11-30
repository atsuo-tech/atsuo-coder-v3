"use server";

import atsuocoder_db, { restrictUser } from "@/lib/atsuocoder_db";
import { notFound, redirect } from "next/navigation";

export default async function NewTaskForm(formData: FormData) {

	await restrictUser("Admin");

	const url_id = formData.get("url_id");

	if (typeof url_id != "string") {

		notFound();

	}

	await atsuocoder_db.task.create({
		data: {
			url_id,
			memory_limit: 0,
			time_limit: 0,
			score: 0,
			title: url_id,
			problem: "",
		}
	});

	redirect("/admin/task");

}
