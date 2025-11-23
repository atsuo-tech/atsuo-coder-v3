import { NextResponse } from "next/server";
import { sitemapContestCache } from "../sitemap";

export async function GET() {

	const contests = (await sitemapContestCache()).filter(contest => contest.end_time <= new Date());

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${contests.map(contest => `  <sitemap>
	<loc>https://judge.w-pcp.dev/contests/${contest.url_id}/tasks/sitemap.xml</loc>
  </sitemap>`).join("\n")}
</sitemapindex>`;

	return new NextResponse(xml, {
		headers: { "Content-Type": "application/xml" },
	});
}
