import { PrismaClient } from '@atsuo-tech/w-auth-prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';

const globalForPrisma = globalThis as unknown as {
	w_auth_db: PrismaClient | undefined;
};

const w_auth_db = globalForPrisma.w_auth_db ?? new PrismaClient({
	adapter: new PrismaPg({
		connectionString: process.env.W_AUTH_DATABASE_URL || "",
	}),
});

if (process.env.NODE_ENV != 'production') globalForPrisma.w_auth_db = w_auth_db;

export default w_auth_db;

export const getCurrentUser = unstable_cache(
	async () => {

		const session_token = (await cookies()).get("SESSION_TOKEN")?.value;

		if (!session_token) return null;

		return w_auth_db.user.findFirst({
			where: {
				login_token: {
					has: session_token,
				},
			},
		});

	},
	['current_user'], { revalidate: 60 * 5, tags: ['current_user'] } // 5 minutes
);

export type UserData = Awaited<ReturnType<typeof getCurrentUser>>;
