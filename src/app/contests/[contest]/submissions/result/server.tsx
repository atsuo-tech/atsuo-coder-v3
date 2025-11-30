"use server";

import atsuocoder_db from "@/lib/atsuocoder_db";
import { evalSubmission, JudgeStatus } from "@/lib/submission";
import { notFound, redirect } from "next/navigation";

export default async function getResult(id: string) {

	const submission = await atsuocoder_db.submission.findUnique({
		where: {
			unique_id: id,
		},
		include: {
			contest: {
				select: {
					url_id: true,
				},
			},
		},
	});

	if (!submission) {

		notFound();

	}

	return evalSubmission(submission);

}
