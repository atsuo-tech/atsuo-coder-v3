import { GetContestType, hasRole } from './atsuocoder_db';
import { getCurrentUser } from './w_auth_db';

export async function ContestViewable(contestData: GetContestType) {

	return (
		!!contestData &&
		(
			await ContestManagable(contestData) ||
			(contestData.start_time.getTime() >= Date.now() && contestData.is_public)
		)
	);

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
