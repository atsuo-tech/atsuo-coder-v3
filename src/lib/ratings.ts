import { unstable_cache } from "next/cache";
import atsuocoder_db from "./atsuocoder_db";
import w_auth_db from "./w_auth_db";

export const getRatingSystems = unstable_cache(async () => atsuocoder_db.ratingSystem.findMany({ orderBy: { rating_name: "asc" } }), ["rating-systems"], { revalidate: 3600 * 24, tags: ["rating"] });
export const getRankedUsers = unstable_cache(
	async (ratingSystemUnique_id: string) => {
		return atsuocoder_db.rating.findMany({
			where: {
				ratingSystemUnique_id,
			},
			orderBy: {
				rating: "desc",
			},
			take: 10,
		}).then((ratings) =>
			Promise.all(
				ratings.map(
					async (rating) => ({
						...rating,
						user: await w_auth_db.user.findUnique({
							where: {
								unique_id: rating.userDataUnique_id,
							},
							select: {
								username: true,
								permission: true,
							},
						}),
					})
				)
			)
		)
	}, ["ranked-users"], { revalidate: 3600 * 24, tags: ["rating"] }
);

export type RatingSystems = Awaited<ReturnType<typeof getRatingSystems>>;
export type RankedUsers = Awaited<ReturnType<typeof getRankedUsers>>;
