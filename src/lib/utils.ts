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
