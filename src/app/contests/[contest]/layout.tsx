import { getContest } from '@/lib/atsuocoder_db';
import { notFound } from 'next/navigation';
import React from 'react';
import styles from './layout.module.css';
import Link from 'next/link';
import Timer from './contest-timer';
import { Metadata } from 'next';

export async function generateMetadata(
	{
		params
	}: {
		params: Promise<{
			contest: string,
		}>,
	}
): Promise<Metadata> {

	const { contest } = await params;

	const contestData = await getContest(contest);

	if (!contestData) {

		notFound();

	}

	return {
		title: `${contestData.title} / AtsuoCoder`,
	};

}

export default async function ContestLayout(
	{
		children,
		params,
	}:
		{
			children: React.ReactNode,
			params: Promise<{ contest: string }>,
		}
) {

	const { contest } = await params;

	const contestData = await getContest(contest);

	if (!contestData) {

		notFound();

	}

	return (
		<div>
			<nav className={styles.nav}>
				<div className={styles.navContestName}>
					<div>
						{contestData.title}
					</div>
					<Timer start_time={contestData.start_time} end_time={contestData.end_time} />
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

			{children}
		</div>
	)

}