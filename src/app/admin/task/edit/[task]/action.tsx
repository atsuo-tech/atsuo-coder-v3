'use server';

import atsuocoder_db, { getContest, getCurrentUserData, hasRole } from '@/lib/atsuocoder_db';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

const schema = z.object({
	old_id: z.string(),
	id: z.string(),
	title: z.string(),
	problem: z.string(),
	memory_limit: z.number(),
	time_limit: z.number(),
	score: z.number(),
	type: z.literal(["Batch", "Communication", "OutputOnly"]),
});

export default async function TaskEditAction(
	formData: FormData,
) {

	const data = schema.parse({
		old_id: formData.get('old_id'),
		id: formData.get('id'),
		title: formData.get('title'),
		problem: formData.get('problem'),
		memory_limit: Number(formData.get('memory_limit')),
		time_limit: Number(formData.get('time_limit')),
		score: Number(formData.get('score')),
		type: formData.get('type'),
	});

	const user = (await getCurrentUserData())!!;

	const taskData = await atsuocoder_db.task.findUnique({
		where: {
			url_id: data.old_id,
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

	if (!taskData || !user || (user.role != "SuperAdmin" && !taskData.TaskManagement.find((management) => management.user.unique_id == user.unique_id))) {

		notFound();

	}

	await atsuocoder_db.task.update({
		where: {
			url_id: data.old_id,
		},
		data: {
			url_id: data.id,
			title: data.title,
			problem: data.problem,
			score: data.score,
			memory_limit: data.memory_limit,
			time_limit: data.time_limit,
			type: data.type,
		},
	});

	redirect("/admin/task");

}
