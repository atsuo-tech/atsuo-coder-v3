import atsuocoder_db, { restrictUser } from "@/lib/atsuocoder_db";
import AdminNotificationEditAction from "./action";
import AdminNotificationEditForm from "./form";
import { notFound } from "next/navigation";

export async function getNotification(unique_id: string) {

	return atsuocoder_db.notification.findUnique({
		where: {
			unique_id,
		},
	});

}

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

	if(!data) {

		notFound();

	}

	return (
		<main>
			<h1>投稿を編集</h1>
			<form
				action={AdminNotificationEditAction}
			>
				<AdminNotificationEditForm data={data} />
			</form>
		</main>
	);

}