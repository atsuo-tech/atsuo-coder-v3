'use server';

import atsuocoder_db, { getContest, getCurrentUserData } from "@/lib/atsuocoder_db";
import { ContestManagable } from "@/lib/contest";
import w_auth_db from "@/lib/w_auth_db";
import assert from "assert";
import { notFound, redirect } from "next/navigation";

export default async function AddTaskManagement(formData: FormData) {

	const task = formData.get('task');
	const username = formData.get('username');
	const role = formData.get('role');

	if (typeof task != 'string' || typeof username != 'string' || typeof role != 'string' || !['editor', 'tester'].includes(role)) {

		notFound();

	}

	const taskData = await atsuocoder_db.task.findFirst({
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

	const currentUser = await getCurrentUserData();

	if (!taskData || !currentUser || (currentUser.role != "SuperAdmin" && !taskData.TaskManagement.find((management) => management.user.unique_id == currentUser.unique_id))) {

		notFound();

	}

	const user = await w_auth_db.user.findUnique({
		where: {
			username,
		},
	});

	if (!user) {

		notFound();

	}

	await atsuocoder_db.taskManagement.create({
		data: {
			taskUnique_id: taskData.unique_id,
			userDataUnique_id: user.unique_id,
			role: role == 'editor' ? 'Editor' : 'Tester',
		},
	});

	redirect(`/admin/task/edit/${task}/management`);

}