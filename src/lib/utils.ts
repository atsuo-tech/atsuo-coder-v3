export function RangeMsToString(
	range: number,
	useMilliseconds = true,
) {
	range = Math.round(range);
	const ms = range % 1000;
	range = Math.floor(range / 1000);
	const sec = range % 60;
	range = Math.floor(range / 60);
	const min = range % 60;
	range = Math.floor(range / 60);
	const hour = range % 24;
	range = Math.floor(range / 24);
	const day = range;
	let res = "";
	if (day > 0) res += ` ${day}日`;
	if (hour > 0) res += ` ${hour}時間`;
	if (min > 0) res += ` ${min}分`;
	if (sec > 0) res += ` ${sec}秒`;
	if (useMilliseconds && ms > 0) res += ` ${ms}ミリ秒`;
	return res.substring(1) || "0エクサ秒";
}

export function DateToForm(date: Date) {
	return date.toLocaleString("ja-JP", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).replace(" ", "T").replaceAll("/", "-");
}

export function RatedRangeToString(rated_range: number[]) {

	return rated_range[0] == -1 ?
		rated_range[1] == -1 ?
			"All" :
			"なし" :
		rated_range[0] + " ~ " + (
			rated_range[1] == -1 ?
				"" :
				rated_range[1]
		)

}

export enum JudgeStatus {
	WJ,
	WR,
	Judging,
	AC,
	WA,
	RE,
	CE,
	TLE,
	MLE,
	QLE,
	PE,
	IE,
};
