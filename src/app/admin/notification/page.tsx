import atsuocoder_db, { restrictUser } from "@/lib/atsuocoder_db";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Link from "next/link";
import { Delete, Edit } from "@mui/icons-material";
import Markdown from "@/components/markdown";

export default async function AdminNotificationPage() {

	await restrictUser("SuperAdmin");

	const notifications = await atsuocoder_db.notification.findMany({
		orderBy: {
			created_at: "desc",
		},
	});

	return (
		<main>

			<h1>投稿を作成</h1>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>作成日時</TableCell>
						<TableCell>題名</TableCell>
						<TableCell>内容</TableCell>
						<TableCell></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell colSpan={4}><Link href="/admin/notification/create">作成</Link></TableCell>
					</TableRow>
					{
						notifications.map((notification, i) =>
							<TableRow key={i}>
								<TableCell>{notification.created_at.toLocaleString("ja-jp")}</TableCell>
								<TableCell>{notification.title}</TableCell>
								<TableCell><Markdown md={notification.description} /></TableCell>
								<TableCell>
									<Link href={`/admin/notification/edit/${notification.unique_id}`}><Edit /></Link>
									<Link href={`/admin/notification/delete/${notification.unique_id}`}><Delete /></Link>
								</TableCell>
							</TableRow>
						)
					}
				</TableBody>
			</Table>

		</main>
	);

}