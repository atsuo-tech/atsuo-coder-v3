import Markdown from "@/components/markdown";
import atsuocoder_db from "@/lib/atsuocoder_db";
import { Box, Paper, Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Posts / AtsuoCoder",
}

export default async function PostsPage() {

	const posts = await atsuocoder_db.notification.findMany({
		where: {
			isPublic: true,
		},
		orderBy: {
			created_at: "desc",
		},
	});

	return (
		<main>

			<h1>投稿</h1>

			{
				posts.map((post, i) =>
					<Paper sx={{ p: 2 }} key={i}>

						<h2>{post.title}</h2>

						<Box sx={{ px: 2 }}>

							<Markdown md={post.description} />
							<Typography variant="caption">作成日時：{post.created_at.toLocaleString("ja-jp")}</Typography>

						</Box>

					</Paper>
				)
			}

		</main>
	)

}