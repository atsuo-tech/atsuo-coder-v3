"use client";

import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { RankedUsers, RatingSystems } from "@/lib/ratings";
import { useState } from "react";

export default function RankingsComponentClient(
	{
		rating_systems,
		ranked_users,
	}: {
		rating_systems: RatingSystems,
		ranked_users: RankedUsers[],
	}
) {

	const [selectedSystem, setSelectedSystem] = useState(0);

	return (
		<>
			<h3 style={{ userSelect: "none" }}>
				Rankings of &nbsp;
				{
					rating_systems.map((system, i) =>
						<span
							key={i}
							style={{
								marginRight: "1em",
								cursor: "pointer",
								textDecoration: selectedSystem == i ? "underline" : "none",
							}}
							onClick={() => setSelectedSystem(i)}
						>
							{system.rating_name}
						</span>
					)
				}
			</h3>

			<div>
				<Table>
					<TableBody>
						{
							ranked_users[selectedSystem].map((user, i) =>
								<TableRow key={i}>
									<TableCell>{i + 1}</TableCell>
									<TableCell>{user.user?.username}</TableCell>
									<TableCell>{user.rating}</TableCell>
								</TableRow>
							)
						}
					</TableBody>
				</Table>
			</div>
		</>
	)

}