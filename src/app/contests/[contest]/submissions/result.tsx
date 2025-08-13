"use server";

import { evalSubmission, type EvalSubmissionReturnType } from '@/lib/submission';
import { JudgeStatus } from '@/lib/utils';
import styles from './submissions.module.css';
import { Suspense } from 'react';
import atsuocoder_db from '@/lib/atsuocoder_db';
import { notFound, redirect } from 'next/navigation';
import { TableCell } from '@mui/material';

const runningTypes = [JudgeStatus.Judging, JudgeStatus.WJ, JudgeStatus.WR];

async function UpdateResult({ id, submissionPage }: { id: string, submissionPage: boolean }) {

	await new Promise<void>((resolve) => setTimeout(resolve, 500));

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

	const info = await evalSubmission(submission);

	if (!runningTypes.includes(info.status) && submissionPage) {

		redirect(`/contests/${submission.contest.url_id}/submissions/${submission.unique_id}`);

	}

	return (
		<ResultTag defaultInfo={info} id={id} submissionPage />
	);

}

export async function SimpleResult({ info }: { info: EvalSubmissionReturnType }) {

	return <span className={`${styles.result} ${styles[JudgeStatus[info.status]]}`}>{info.display}</span>

}

export default async function ResultTag({ defaultInfo, id, submissionPage }: { defaultInfo: EvalSubmissionReturnType, id: string, submissionPage?: boolean }) {

	if (!submissionPage) {

		submissionPage = false;

	}

	if (runningTypes.includes(defaultInfo.status)) {

		return (
			<Suspense fallback={
				<TableCell colSpan={3}>
					<SimpleResult info={defaultInfo} />
				</TableCell>
			}>
				<UpdateResult id={id} submissionPage={submissionPage} />
			</Suspense>
		)

	}

	const largeResult = [JudgeStatus.CE, JudgeStatus.IE].includes(defaultInfo.status);

	return (
		<>
			<TableCell colSpan={largeResult ? 3 : 1}>
			<SimpleResult info={defaultInfo} />
		</TableCell >
			{
				!largeResult &&
		<>
			<TableCell>{defaultInfo.run_time} ms</TableCell>
			<TableCell>{defaultInfo.memory} KB</TableCell>
		</>
}
		</>
	);

}
