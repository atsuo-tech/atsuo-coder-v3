import atsuocoder_db, { GetContestType, hasRole } from './atsuocoder_db';
import { getCurrentUser } from './w_auth_db';

export async function ContestViewable(contestData: GetContestType) {

	const user = await getCurrentUser();

	return (
		!!contestData &&
		(
			Date.now() >= contestData.end_time.getTime() ||
			(
				!!user &&
				(
					await ContestManagable(contestData) ||
					(
						Date.now() >= contestData.start_time.getTime() &&
						!!(await getContestRegistration(contestData))
					)
				)
			)
		)
	);

}

export async function ContestSubmitable(contestData: GetContestType) {

	const user = await getCurrentUser();

	return (
		!!user &&
		!!contestData &&
		(
			await ContestManagable(contestData) ||
			(
				Date.now() >= contestData.start_time.getTime() &&
				!!(await getContestRegistration(contestData))
			) ||
			Date.now() >= contestData.end_time.getTime()
		)
	);

}

export async function ContestRegistable(contestData: GetContestType) {

	return contestData && Date.now() <= contestData.start_time.getTime();

}

export async function getContestRegistration(contestData: GetContestType) {

	if (!contestData) {

		return null;

	}

	const user = await getCurrentUser();

	if (!user) {

		return null;

	}

	return await atsuocoder_db.contestRegistration.findFirst({
		where: {
			contestUnique_id: contestData?.unique_id,
			userDataUnique_id: user?.unique_id,
		},
	});

}

export async function ContestManagable(contestData: GetContestType) {

	const user = await getCurrentUser();

	return (
		!!contestData &&
		!!user &&
		(
			!!(contestData.ContestManagement.find((management) => management.user.unique_id == user?.unique_id)) ||
			await hasRole('SuperAdmin')
		)
	);

}

export async function ContestEnded(contestData: GetContestType) {

	return (
		!!contestData &&
		contestData.end_time.getTime() <= Date.now()
	);

}
