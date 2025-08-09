'use server';

import atsuocoder_db, { restrictUser } from "@/lib/atsuocoder_db";
import { redirect } from "next/navigation";

export default async function ContestCreateAction({ message }: { message: string }, formData: FormData) {

	restrictUser('SuperAdmin');

	const url_id = formData.get('url_id');

	if (!url_id || typeof url_id != 'string') {

		return { message: 'Invalid Input' };

	}

	const contest = await atsuocoder_db.contest.findFirst({
		where: {
			url_id,
		},
	});

	if (contest != null) {

		return { message: 'Already Exists' };

	}

	await atsuocoder_db.contest.create({
		data: {
			url_id,
			title: '',
			description: '',
			start_time: new Date(0),
			end_time: new Date(0),
			is_permanent: false,
		}
	});

	redirect(`/admin/contest/edit/${url_id}`);

}