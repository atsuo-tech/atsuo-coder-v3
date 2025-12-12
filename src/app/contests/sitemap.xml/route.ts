import { getPublicContests } from "@/lib/contest";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {

	const contests = await getPublicContests();

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${contests.map((contest) => `
<url>
	<loc>https://judge.w-pcp.dev/contests/${contest.url_id}</loc>
	<changefreq>weekly</changefreq>
	<priority>0.7</priority>
</url>
`).join('')}
    </urlset>
  `;
  
	return new NextResponse(xml, {
		headers: { "Content-Type": "application/xml" },
	});
}
