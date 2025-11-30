import { getContest } from '@/lib/atsuocoder_db';
import { notFound } from 'next/navigation';
import React from 'react';
import styles from './layout.module.css';
import Link from 'next/link';
import Timer from './contest-timer';
import { Metadata } from 'next';
import { PushPin, PinDrop } from '@mui/icons-material';
import Nav from './nav';

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
			<Nav contestData={contestData} />

			{children}
		</div>
	)

}