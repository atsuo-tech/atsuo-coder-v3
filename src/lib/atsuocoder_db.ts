import { PrismaClient, UserRole } from '@prisma/atsuocoder/client';
import { getCurrentUser } from './w_auth_db';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const globalForPrisma = globalThis as unknown as {
	atsuocoder_db: PrismaClient | undefined;
};

const atsuocoder_db = globalForPrisma.atsuocoder_db ?? new PrismaClient();

if (process.env.NODE_ENV != 'production') globalForPrisma.atsuocoder_db = atsuocoder_db;

export default atsuocoder_db;

export const getContest = cache(
	async (contest: string) => {

		const contestData = await atsuocoder_db.contest.findFirst({
			where: {
				url_id: contest,
			},
			include: {
				ContestManagement: {
					select: {
						role: true,
						user: {
							select: {
								unique_id: true,
							},
						},
					},
				},
				TaskUse: {
					select: {
						assignment: true,
						task: {
							select: {
								title: true,
								url_id: true,
								unique_id: true,
								time_limit: true,
								memory_limit: true,
								score: true,
								type: true,
							},
						},
					},
					orderBy: [
						{
							index: "asc",
						},
						{
							assignment: "asc",
						},
					],
				},
			},
		});

		return contestData;

	}
);

export type GetContestType = Awaited<ReturnType<typeof getContest>>;

export async function getCurrentUserData() {

	const user = await getCurrentUser();

	return user && atsuocoder_db.userData.findFirst({
		where: {
			unique_id: user.unique_id,
		},
	});

}

export async function hasRole(role: UserRole) {

	const userData = await getCurrentUserData();

	const roleIndex = [
		UserRole.Member,
		UserRole.Admin,
		UserRole.SuperAdmin,
	];

	return !!userData && roleIndex.indexOf(userData.role) >= roleIndex.indexOf(role);

}

export async function restrictUser(role: UserRole) {

	if (!(await hasRole(role))) {

		notFound();

	}

}
