"use client";

import { type EvalSubmissionReturnType } from '@/lib/submission';
import { JudgeStatus } from '@/lib/utils';
import styles from '../submissions.module.css';
import { useState } from 'react';
import { TableCell } from '@mui/material';

const runningTypes = [JudgeStatus.Judging, JudgeStatus.WJ, JudgeStatus.WR];

export function SimpleResult({ info }: { info: EvalSubmissionReturnType }) {

	return <span className={`${styles.result} ${styles[JudgeStatus[info.status]]}`}>{info.display}</span>

}

export default function ResultTag({ defaultInfo, id, submissionPage }: { defaultInfo: EvalSubmissionReturnType, id: string, submissionPage?: boolean }) {

	if (!submissionPage) {

		submissionPage = false;

	}

	const [info, setInfo] = useState(defaultInfo);

	const largeResult = [...runningTypes, JudgeStatus.CE, JudgeStatus.IE].includes(info.status);

	return (
		<>
			<TableCell colSpan={largeResult ? 3 : 1}>
				<SimpleResult info={info} />
			</TableCell >
			{
				!largeResult &&
				<>
					<TableCell>{Math.round(info.run_time * 1000)} ms</TableCell>
					<TableCell>{info.memory} KB</TableCell>
				</>
			}
		</>
	);

}
