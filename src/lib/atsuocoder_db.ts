import { PrismaClient } from '@prisma/atsuocoder/client';

const globalForPrisma = globalThis as unknown as {
	atsuocoder_db: PrismaClient | undefined;
};

const atsuocoder_db = globalForPrisma.atsuocoder_db ?? new PrismaClient();

if (process.env.NODE_ENV != 'production') globalForPrisma.atsuocoder_db = atsuocoder_db;

export default atsuocoder_db;

export async function getContest(contest: string) {

	const contestData = await atsuocoder_db.contest.findFirst({
		where: {
			url_id: contest,
		},
		include: {
			ContestManagement: {
				select: {
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
