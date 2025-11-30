import { restrictUser } from "@/lib/atsuocoder_db";
import AdminNotificationCreateAction from "./action";
import AdminNotificationCreateForm from "./form";

export default async function AdminNotificationCreatePage() {

	await restrictUser("SuperAdmin");

	return (
		<main>
			<h1>投稿を作成</h1>
			<form
				action={AdminNotificationCreateAction}
			>
				<AdminNotificationCreateForm />
			</form>
		</main>
	);

}