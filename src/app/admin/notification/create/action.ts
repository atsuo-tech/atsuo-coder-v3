"use server";

import atsuocoder_db, { restrictUser } from "@/lib/atsuocoder_db";
import { revalidateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";

export default async function AdminNotificationCreateAction(formData: FormData) {

	await restrictUser("SuperAdmin");

	const title = formData.get('title');
	const description = formData.get('description');
	const isPublic = formData.get('is_public');

	if (typeof title != "string" || typeof description != "string" || typeof isPublic != "string") {

		notFound();

	}

	await atsuocoder_db.notification.create({
		data: {
			title,
			description,
			isPublic: isPublic == "true",
		},
	});

	revalidateTag('notifications');

	redirect("/admin/notification");

}