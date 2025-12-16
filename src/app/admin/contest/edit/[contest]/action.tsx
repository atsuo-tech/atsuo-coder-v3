'use server';

import atsuocoder_db, { getContest, hasRole, restrictUser } from '@/lib/atsuocoder_db';
import { ContestManagable } from '@/lib/contest';
import { getCurrentUser } from '@/lib/w_auth_db';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

const schema = z.object({
	old_id: z.string(),
	id: z.string(),
	title: z.string(),
	description: z.string(),
	is_permanent: z.literal(['true', 'false']),
	start_time: z.iso.datetime({ local: true }),
	end_time: z.iso.datetime({ local: true }),
	rated_range_from: z.number(),
	rated_range_to: z.number(),
	is_public: z.literal(['true', 'false']),
});

export default async function ContestEditAction(
	formData: FormData,
) {

	const data = schema.parse({
		old_id: formData.get('old_id'),
		id: formData.get('id'),
		title: formData.get('title'),
		description: formData.get('description'),
		is_permanent: formData.get('is_permanent'),
		start_time: formData.get('start_time'),
		end_time: formData.get('end_time'),
		rated_range_from: Number(formData.get('rated_range_from')),
		rated_range_to: Number(formData.get('rated_range_to')),
		is_public: formData.get('is_public'),
	});

	const user = (await getCurrentUser())!!;

	const contestData = await getContest(data.old_id);

	if (!(await ContestManagable(contestData))) {

		notFound();

	}

	if (!contestData) {

		notFound();

	}

	await atsuocoder_db.contest.update({
		where: {
			url_id: data.old_id,
		},
		data: {
			url_id: data.id,
			title: data.title,
			description: data.description,
			is_permanent: data.is_permanent == 'true',
			start_time: new Date(data.start_time + '+09:00'),
			end_time: new Date(data.end_time + '+09:00'),
			rated_range: [
				data.rated_range_from,
				data.rated_range_to,
			],
			is_public: data.is_public == 'true',
		}
	});

	redirect("/admin/contest");

}
