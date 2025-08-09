import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Link from "next/link";

export default function AdminTaskPage() {

	return (
		<main>

			<h1>Task Management</h1>

			<h2>問題一覧</h2>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ID</TableCell>
						<TableCell>タイトル</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell colSpan={2}>
							<Link href="/admin/task/new">作成</Link>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>awtf2025_a</TableCell>
						<TableCell>
							<Link href="/admin/task/edit/awtf2025_a">
								Console.log
							</Link>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>

		</main>
	);

}