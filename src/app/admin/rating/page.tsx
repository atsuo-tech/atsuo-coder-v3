import atsuocoder_db, { getContest, restrictUser } from "@/lib/atsuocoder_db";
import { getRatingSystems } from "@/lib/ratings";
import { getContestStandings } from "@/lib/standing";
import { Accordion, AccordionSummary, Box, Button, Divider, MenuItem, Select, TextField } from "@mui/material";
import { revalidateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";

export default async function RatingManagementPage() {

	await restrictUser("SuperAdmin");

	const rating_systems = await getRatingSystems();

	return (
		<main>

			<h1>Rating Management</h1>

			<Accordion defaultExpanded>

				<AccordionSummary>Apply</AccordionSummary>

				<Divider />

				<Box sx={{ m: 2 }}>

					<form
						action={
							async (formData: FormData) => {
								"use server";
								await restrictUser("SuperAdmin");
								const contest = formData.get("contest_id")?.toString() || "";
								const contestData = await getContest(contest);
								const rating_system_id = formData.get("rating_system")?.toString() || "";
								const center = Number(formData.get("center") || "1200");
								const perf_factor = Number(formData.get("perf_factor") || "1");
								const rated_bound = Number(formData.get("rated_bound") || "Infinity");
								if (!contestData || !rating_system_id || isNaN(center) || isNaN(perf_factor) || isNaN(rated_bound)) {
									notFound();
								}
								const rating_systems = await getRatingSystems();
								const rating_system = rating_systems.find((s) => s.unique_id == rating_system_id);
								if (!rating_system) {
									notFound();
								}
								const data = await getContestStandings(contest, true);
								if (!data) {
									notFound();
								}
								const rank_count: { [key: number]: number } = {};
								data.ranking.forEach((v) => {
									rank_count[v.rank] = (rank_count[v.rank] || 0) + 1;
								});
								const rated_users = await atsuocoder_db.contestRegistration.findMany({
									where: {
										contestUnique_id: contestData.unique_id,
										type: "Rated",
									},
									include: {
										user: {
											select: {
												unique_id: true,
												Rating: {
													where: { ratingSystemUnique_id: rating_system.unique_id },
												},
												RatingChangeLog: {
													where: { ratingSystemUnique_id: rating_system.unique_id },
												},
											},
										},
									},
								});
								const aperformances = [];
								for (let i = 0; i < rated_users.length; i++) {
									const logs = rated_users[i].user.RatingChangeLog.filter((log) => log.ratingSystemUnique_id == rating_system.unique_id);
									if (logs.length == 0) {
										aperformances.push(center);
										continue;
									}
									let ps = 0, qs = 0;
									for (let j = 0; j < logs.length; j++) {
										ps += logs[j].performance * Math.pow(0.9, j);
										qs += Math.pow(0.9, j);
									}
									aperformances.push(ps / qs);
								}
								const performances = [];
								for (let i = 0; i < data.ranking.length; i++) {
									let rs = data.ranking[i].rank + ((rank_count[data.ranking[i].rank] - 1) / 2) - 0.5;
									let ok = -9999, ng = 9999;
									while (ng - ok > 1e-4) {
										const mid = (ok + ng) / 2;
										let now = 0;
										for (let j = 0; j < rated_users.length; j++) {
											now += 1 / (1 + Math.pow(6.0, (mid - aperformances[j]) / 400));
										}
										if (now < rs) {
											ng = mid;
										} else {
											ok = mid;
										}
									}
									ok = (ok - center) * perf_factor + center;
									performances.push(Math.min(ok, rated_bound + 400));
								}
								for (let i = 0; i < rated_users.length; i++) {
									const logs = rated_users[i].user.RatingChangeLog.filter((log) => log.ratingSystemUnique_id == rating_system.unique_id);
									const rank = data.ranking.find((v) => v.unique_id == rated_users[i].user.unique_id)!!.rank!! - 1;
									const performance = performances[rank];
									let ps = Math.pow(2, performance / 800), qs = 1;
									for (let j = 0; j < logs.length; j++) {
										ps += Math.pow(2, logs[j].performance / 800) * Math.pow(0.9, j + 1);
										qs += Math.pow(0.9, j + 1);
									}
									const rated_count = logs.length + 1;
									const new_rating = Math.log2(ps / qs) * 800;
									function largeF(n: number) {
										let ps = 0, qs = 0;
										for (let i = 1; i <= n; i++) {
											ps += Math.pow(0.81, i);
											qs += Math.pow(0.9, i);
										}
										return Math.sqrt(ps) / qs;
									}
									const infs = 0.1 / Math.sqrt(0.19);
									const mapped_rating = new_rating - (largeF(rated_count) - infs) / (largeF(1) - infs) * 1200;
									const true_rating = (mapped_rating >= 400 ? mapped_rating : 400 / Math.exp((400 - mapped_rating) / 400));
									await atsuocoder_db.ratingChangeLog.create({
										data: {
											userDataUnique_id: rated_users[i].user.unique_id,
											contestUnique_id: contestData.unique_id,
											ratingSystemUnique_id: rating_system.unique_id,
											old_rating: rated_users[i].user.Rating[0]?.rating || 0,
											new_rating: true_rating,
											performance: performance,
											rank: rank + 1,
										},
									});
									await atsuocoder_db.rating.upsert({
										where: {
											userDataUnique_id_ratingSystemUnique_id: {
												userDataUnique_id: rated_users[i].user.unique_id,
												ratingSystemUnique_id: rating_system.unique_id,
											},
										},
										create: {
											userDataUnique_id: rated_users[i].user.unique_id,
											ratingSystemUnique_id: rating_system.unique_id,
											rating: true_rating,
											inner_rating: new_rating,
										},
										update: {
											rating: true_rating,
											inner_rating: new_rating,
										},
									});
								}
								revalidateTag("rating");
								redirect("/rankings");
							}
						}
					>

						<Select fullWidth defaultValue={rating_systems[0]?.unique_id || ""} label="Rating System" name="rating_system">
							{
								rating_systems.map((system, i) =>
									<MenuItem key={i} value={system.unique_id}>
										{system.rating_name}
									</MenuItem>
								)
							}
						</Select>
						<TextField label="Contest ID" variant="outlined" fullWidth name="contest_id" />
						<TextField label="Center" variant="outlined" fullWidth type="number" defaultValue={1200} name="center" />
						<TextField label="Perf-Factor" variant="outlined" fullWidth type="number" defaultValue={1} name="perf_factor" />
						<TextField label="RatedBound" variant="outlined" fullWidth type="number" defaultValue={99999} name="rated_bound" />

						<Button variant="contained" color="primary" type="submit" fullWidth>Apply</Button>

					</form>

				</Box>

			</Accordion>

			<Accordion>

				<AccordionSummary>Rollback</AccordionSummary>

				<Divider />

				<Box sx={{ m: 2 }}>

					<TextField label="Contest ID" variant="outlined" fullWidth />

					<Button variant="contained" color="warning" fullWidth>Rollback</Button>

				</Box>

			</Accordion>

		</main>
	)

}