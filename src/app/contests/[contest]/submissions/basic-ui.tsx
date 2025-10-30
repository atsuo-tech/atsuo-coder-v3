import { getContest } from "@/lib/atsuocoder_db";
import { ContestEnded, ContestManagable, ContestViewable } from "@/lib/contest";
import { notFound, redirect } from "next/navigation";
import assert from "assert";
import w_auth_db, { getCurrentUser } from "@/lib/w_auth_db";
import Link from "next/link";
import SubmissionsTable, { Searcher } from "@/components/submissions-table";
import type { Prisma } from "@prisma/atsuocoder/client";
import getTask from "@/lib/task";

export default async function SubmissionsPageUI(
	{
		title,
		params,
		searchParams,
		where,
		url,
	}: {
		title: string,
		params: Promise<{
			contest: string,
		}>,
		searchParams: Promise<{
			page: string
		} & Searcher>,
		where: Prisma.SubmissionWhereInput,
		url: string,
	}
) {

	const { contest } = await params;
	const { page, language, task, user, sort_by } = await searchParams;

	let pageInt = parseInt(page);

	if (isNaN(pageInt)) {

		pageInt = 0;

	}

	const userData = await getCurrentUser();

	const contestData = await getContest(contest);

	if (!(await ContestViewable(contestData) && await ContestEnded(contestData)) && !(await ContestManagable(contestData))) {

		if (await ContestViewable(contestData)) {

			redirect(`/contests/${contest}/submissions/me`);

		}

		notFound();

	}

	assert(contestData);
	assert(userData);

	if (user) {

		if (user === "me") {

			where.userDataUnique_id = userData.unique_id;

		} else {

			where.userDataUnique_id = (await w_auth_db.user.findFirst({
				where: {
					username: user,
				},
				select: {
					unique_id: true,
				},
			}))?.unique_id;

			if (!where.userDataUnique_id) {

				notFound();

			}

		}

	}

	const taskData = task && await getTask(contest, task);

	if (task && !taskData) {

		notFound();

	}

	return (
		<main>
			<h1>{title}</h1>
			<Link href={`/contests/${contest}/submissions`}>すべての提出</Link>
			<Link href={`/contests/${contest}/submissions/me`}>あなたの提出</Link>
			<SubmissionsTable
				contestData={contestData}
				pageInt={pageInt}
				where={{
					...where,
					languageDataLanguage_id: !language ? undefined : parseInt(language),
					taskUnique_id: taskData ? taskData.taskData.unique_id : undefined,
				}}
				orderBy={
					!sort_by ? {
						created_at: "desc",
					} : sort_by === "newest" ? {
						created_at: "desc",
					} : sort_by === "oldest" ? {
						created_at: "asc",
					} : {
						created_at: "desc",
					}
				}
				url={url}
			/>
		</main>
	)

}