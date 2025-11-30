"use server";

import atsuocoder_db from "@/lib/atsuocoder_db";
import { evalSubmission, evaluatableSubmissionIncluder } from "@/lib/submission";
import { notFound } from "next/navigation";

export default async function getResult(id: string) {

	const submission = await atsuocoder_db.submission.findUnique({
		where: {
			unique_id: id,
		},
		include: evaluatableSubmissionIncluder,
	});

	if (!submission) {

		notFound();

	}

	return evalSubmission(submission);

}
