import { getRankedUsers, getRatingSystems } from "@/lib/ratings";
import RankingsComponentClient from "./client";

export default async function RankingsComponent() {

	const rating_systems = await getRatingSystems();

	if (rating_systems.length == 0) {
		return (
			<>
				<h3>Rankings</h3>
				<div>
					<p>No rating system available.</p>
				</div>
			</>
		)
	}

	const ranked_users = await Promise.all(rating_systems.map(async (sytstem) => getRankedUsers(sytstem.unique_id)));

	return (
		<RankingsComponentClient
			rating_systems={rating_systems}
			ranked_users={ranked_users}
		/>
	)

}