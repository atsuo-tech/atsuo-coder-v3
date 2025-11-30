import atsuocoder_db from "@/lib/atsuocoder_db";

export async function getNotification(unique_id: string) {

	return atsuocoder_db.notification.findUnique({
		where: {
			unique_id,
		},
	});

}
