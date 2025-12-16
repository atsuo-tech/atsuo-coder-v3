import atsuocoder_db, { restrictUser } from "@/lib/atsuocoder_db";
import { notFound, redirect } from "next/navigation";
import { Button } from "@mui/material";
import Markdown from "@/components/markdown";
import { getNotification } from "@/app/admin/contest/lib";

export default async function AdminNotificationEditPage(
	{
		params,
	}: {
		params: Promise<{
			id: string
		}>,
	}
) {

	await restrictUser("SuperAdmin");

	const { id } = await params;

	const data = await getNotification(id);

	if (!data) {

		notFound();

	}

	return (
		<main>
			<h1>削除？</h1>
			<h2>タイトル</h2>
			{data.title}
			<h2>内容</h2>
			<Markdown md={data.description} />
			<Button
				onClick={async () => {
					"use server";
					await atsuocoder_db.notification.delete({
						where: {
							unique_id: id,
						},
					});
					redirect("/admin/notification");
				}}
				fullWidth
				variant="contained"
			>
				削除！
			</Button>
		</main>
	);

}