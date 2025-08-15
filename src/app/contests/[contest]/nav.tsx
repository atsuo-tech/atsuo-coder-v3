"use client";

import { PushPin, PushPinOutlined } from "@mui/icons-material";
import Timer from "./contest-timer";
import styles from "./layout.module.css";
import Link from "next/link";
import { type GetContestType } from "@/lib/atsuocoder_db";
import { useEffect, useState } from "react";

export default function Nav(
	{
		contestData,
	}: {
		contestData: Exclude<GetContestType, null>,
	},
) {

	const contest = contestData.url_id;

	const [pinned, setPinned] = useState(true);

	useEffect(() => {
		const pinned = localStorage.getItem("contest_pinned");
		if (pinned) setPinned(pinned == "true");
	}, []);

	useEffect(() => {
		localStorage.setItem("contest_pinned", pinned ? "true" : "false");
	}, [pinned]);

	return (
		<nav className={`${styles.nav} ${pinned ? styles.pinned : ""}`}>
			<div className={styles.navContestName}>
				<div>
					{contestData.title}
				</div>
				<Timer start_time={contestData.start_time} end_time={contestData.end_time} />
				<div
					className={styles.pin}
					onClick={() => {
						setPinned(!pinned);
					}}
				>
					{
						!pinned ?
							<PushPin /> :
							<PushPinOutlined />
					}
				</div>
			</div>
			<div className={styles.navOthers}>
				<div>
					<Link href={`/contests/${contest}`}>Home</Link>
				</div>
				<div>
					<Link href={`/contests/${contest}/tasks`}>Tasks</Link>
				</div>
				<div>
					<Link href={`/contests/${contest}/clar`}>Clar</Link>
				</div>
				<div>
					<Link href={`/contests/${contest}/submissions`}>Submissions</Link>
				</div>
				<div>
					<Link href={`/contests/${contest}/standings`}>Standings</Link>
				</div>
			</div>
		</nav>
	);

}