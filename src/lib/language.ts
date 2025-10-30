import atsuocoder_db from "./atsuocoder_db";

export default async function getLanguageData() {

	return atsuocoder_db.languageData.findMany({
		orderBy: {
			name: "asc",
		},
	});

}