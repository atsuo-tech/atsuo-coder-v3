const languages = {

	"0": "c_cpp",
	"1": "bash",
	"2": "python",

} as const;

export default languages as { [key: string]: (typeof languages)[keyof typeof languages] };