import atsuocoder_db from '@/lib/atsuocoder_db';
import type { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache';

export const sitemapContestCache = unstable_cache(async () => {

	const contests = await atsuocoder_db.contest.findMany({
		where: {
			is_public: true,
		},
		orderBy: {
			start_time: "asc",
		},
	});

	return contests;

}, ["sitemap-contest-list"], { revalidate: 60 * 60 });

export default async function ContestSitemap(): Promise<MetadataRoute.Sitemap> {

	const contests = await sitemapContestCache();

	return contests.map((contest) => (
		{
			url: `https://judge.w-pcp.dev/contests/${contest.url_id}`,
			lastModified: (contest.end_time.getTime() >= Date.now() ? contest.end_time : undefined),
			changeFrequency: 'weekly',
			priority: 0.7,
		} as MetadataRoute.Sitemap[number]
	));
}