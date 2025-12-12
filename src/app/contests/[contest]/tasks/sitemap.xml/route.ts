import { getContest } from '@/lib/atsuocoder_db';
import { ContestViewable } from '@/lib/contest';
import assert from 'assert';
import { MetadataRoute } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

export async function GET(
	_: Request,
	{
		params,
	}: {
		params: Promise<{ contest: string }>,
	}
) {

	const { contest } = await params;

	const contestData = await getContest(contest);

	if (!(await ContestViewable(contestData))) {

		notFound();

	}

	assert(contestData);

	const {
		TaskUse,
	} = contestData;

	const data = TaskUse.map((element) => (
		{
			url: `https://judge.w-pcp.dev/contests/${contest}/tasks/${element.task.url_id}`,
			priority: 0.6,
		} as MetadataRoute.Sitemap[number]
	));

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${data.map((entry) => `  <url>
	<loc>${entry.url}</loc>
	<priority>${entry.priority}</priority>
  </url>`).join("\n")}
</urlset>`;	

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
		},
	});

}