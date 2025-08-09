"use client";

import type { EvalSubmissionReturnType } from '@/lib/submission';
import { JudgeStatus } from '@/lib/utils';
import styles from './submissions.module.css';

export default function ResultTag({ info }: { info: EvalSubmissionReturnType }) {

	return (<span className={`${styles.result} ${styles[JudgeStatus[info.status]]}`}>{info.display}</span>)

}
