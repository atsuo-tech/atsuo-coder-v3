'use client';

import { RangeMsToString } from "@/lib/utils";
import { useEffect, useRef } from "react";
import styles from "./layout.module.css";

export default function Timer(
	{
		start_time,
		end_time,
	}:
		{
			start_time: Date,
			end_time: Date,
		}
) {

	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {

		if (Date.now() <= start_time.getTime() && start_time.getTime() - Date.now() <= 60000) {

			setTimeout(() => {

				location.reload();

			}, start_time.getTime() - Date.now());

		}

		setInterval(() => {

			if (!ref.current) return;

			if (Date.now() <= start_time.getTime()) {

				ref.current.innerText = "開始まで：" + RangeMsToString(start_time.getTime() - Date.now(), false);
				return;

			}

			if (end_time.getTime() <= Date.now()) {

				ref.current.innerText = "終了";
				return;

			}

			ref.current.innerText = "残り時間：" + RangeMsToString(end_time.getTime() - Date.now(), false);

		}, 50);

	});

	return (
		<div ref={ref} className={styles.timer}>
			読込中…
		</div>
	)

}
