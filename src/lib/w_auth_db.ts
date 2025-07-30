import { PrismaClient } from '@prisma/w-auth/client';
import { cookies } from 'next/headers';

const globalForPrisma = globalThis as unknown as {
	w_auth_db: PrismaClient | undefined;
};

const w_auth_db = globalForPrisma.w_auth_db ?? new PrismaClient();

if (process.env.NODE_ENV != 'production') globalForPrisma.w_auth_db = w_auth_db;

export default w_auth_db;

export async function getCurrentUser() {

	const session_token = (await cookies()).get("SESSION_TOKEN")?.value;

	if (!session_token) return null;

	return w_auth_db.user.findFirst({
		where: {
			login_token: {
				has: session_token,
			},
		},
	});

}
