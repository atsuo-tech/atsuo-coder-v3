"use server";

import atsuocoder_db, { restrictUser } from "@/lib/atsuocoder_db";
import { revalidateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";

export default async function AdminNotificationEditAction(formData: FormData) {

	await restrictUser("SuperAdmin");

	const unique_id = formData.get('unique_id');
	const title = formData.get('title');
	const description = formData.get('description');
	const isPublic = formData.get('is_public');

	if (typeof unique_id != "string" || typeof title != "string" || typeof description != "string" || typeof isPublic != "string") {

		notFound();

	}

	await atsuocoder_db.notification.update({
		where: {
			unique_id,
		},
		data: {
			title,
			description,
			isPublic: isPublic == "true",
		},
	});

	revalidateTag('notifications');

	redirect("/admin/notification");

}