"use client";

import { type EvalSubmissionReturnType } from '@/lib/submission';
import styles from '../submissions.module.css';
import { TableCell } from '@mui/material';
import type { JudgeStatus } from '@atsuo-tech/atsuo-coder-v3-prisma';

const runningTypes = ["Judging", "WJ", "WR"] as JudgeStatus[];

export function SimpleResult({ info }: { info: EvalSubmissionReturnType }) {

	return <span className={`${styles.result} ${styles[info.status]}`}>{info.display}</span>

}

export default function ResultTag({ defaultInfo: info, id, submissionPage }: { defaultInfo: EvalSubmissionReturnType, id: string, submissionPage?: boolean }) {

	if (!submissionPage) {

		submissionPage = false;

	}

	const largeResult = ([...runningTypes, "CE", "IE"] as (typeof info.status)[]).includes(info.status);

	return (
		<>
			<TableCell colSpan={largeResult ? 3 : 1}>
				<SimpleResult info={info} />
			</TableCell >
			{
				!largeResult &&
				<>
					<TableCell>{info.run_time} ms</TableCell>
					<TableCell>{info.memory} KB</TableCell>
				</>
			}
		</>
	);

}
