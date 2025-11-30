import User from '@/components/user';
import atsuocoder_db from '@/lib/atsuocoder_db';
import { getRatingSystems } from '@/lib/ratings';
import w_auth_db from '@/lib/w_auth_db';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
	title: "Rankings / AtsuoCoder",
}

export default async function RankingsPage(
	{
		searchParams,
	}: {
		searchParams: Promise<{
			system?: string,
		}>,
	},
) {

	const { system } = await searchParams;

	const rating_systems = await getRatingSystems();
	const rating_system = system ? rating_systems.find((s) => s.rating_name == system) : rating_systems[0];

	if (!rating_system) {

		notFound();

	}

	const ratings = await atsuocoder_db.rating.findMany({
		where: {
			ratingSystemUnique_id: rating_system.unique_id,
		},
		orderBy: {
			rating: "desc",
		},
	});

	const authUsers = await w_auth_db.user.findMany({
		where: {
			unique_id: {
				in: ratings.map((user) => user.userDataUnique_id),
			},
		},
	});

	return (
		<main>

			<h1>Rankings of {rating_system.rating_name}</h1>

			<div>
				{
					rating_systems.map((system, i) =>
						<Link
							key={i}
							style={{
								marginRight: "1em",
								cursor: "pointer",
								color: "black",
								textDecoration: rating_system.unique_id == system.unique_id ? "underline" : "none",
							}}
							href={`/rankings?system=${encodeURIComponent(system.rating_name)}`}
						>
							{system.rating_name}
						</Link>
					)
				}
			</div>

			<h2>レーティング</h2>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>順位</TableCell>
						<TableCell>ユーザ名</TableCell>
						<TableCell>卒業回</TableCell>
						<TableCell>レーティング</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						ratings.map((rating, i) => {
							const userInfo = authUsers.find((authUser) => authUser.unique_id == rating.userDataUnique_id);

							if (!userInfo) {

								return (
									<TableRow key={i}>
										<TableCell colSpan={4}>Unknown User</TableCell>
									</TableRow>
								);

							}

							return (
								<TableRow key={i}>
									<TableCell>{i + 1}</TableCell>
									<TableCell><User unique_id={rating.userDataUnique_id} /></TableCell>
									<TableCell>{userInfo.grade}</TableCell>
									<TableCell>{rating.rating}</TableCell>
								</TableRow>
							)
						})
					}
				</TableBody>
			</Table>

		</main>
	);

}