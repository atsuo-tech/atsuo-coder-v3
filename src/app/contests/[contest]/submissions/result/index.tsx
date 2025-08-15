"use client";

import { type EvalSubmissionReturnType } from '@/lib/submission';
import { JudgeStatus } from '@/lib/utils';
import styles from '../submissions.module.css';
import { useEffect, useState } from 'react';
import { TableCell } from '@mui/material';
import getResult from './server';

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

	useEffect(() => {

		if (!runningTypes.includes(info.status)) {

			return;

		}

		const interval = setInterval(async () => {

			const newInfo = await getResult(id);

			setInfo(newInfo);

			if (!runningTypes.includes(newInfo.status)) {

				clearInterval(interval);

				if (submissionPage) {

					location.reload();

				}

			}

		}, 500);


	}, [id, info.status]);

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
