import type { Submission } from "@prisma/atsuocoder";
import atsuocoder_db from "./atsuocoder_db";
import { JudgeStatus } from "./utils";
export { JudgeStatus } from "./utils";

export interface JudgeResult {
	status?: JudgeStatus;
	compile_error?: string;
	testcases?: {
		[key: string]: {
			status: JudgeStatus;
			time: number;
			memory: number;
			error_type?: number;
			score?: number;
		};
	};
}

export async function evalSubmission(submission: Submission) {

	const result = submission.result as unknown as JudgeResult;

	if (result.status) {

		return {
			set_results: [],
			case_results: [],
			score: 0,
			run_time: -1,
			memory: -1,
			status: result.status,
			display: JudgeStatus[result.status],
		};

	}

	const testcases = result.testcases;

	console.log(testcases);

	let run_time = -1;
	let memory = -1;
	let status = JudgeStatus.WJ;

	const testsetData = await atsuocoder_db.testSet.findMany({
		where: {
			taskUnique_id: submission.taskUnique_id,
		},
		select: {
			set_name: true,
			set_index: true,
			score: true,
			TestCaseUse: {
				select: {
					testcase: {
						select: {
							case_name: true,
							unique_id: true,
						},
					},
				},
			},
		},
	});

	const testcaseData = await atsuocoder_db.testCase.findMany({
		where: {
			TestCaseUse: {
				some: {
					testset: {
						taskUnique_id: submission.taskUnique_id,
					},
				},
			},
		},
	});

	const set_results: { status: JudgeStatus, run_time: number, memory: number, set_name: string, score: number }[] = [];
	const case_results: { status: JudgeStatus, run_time: number, memory: number, case_name: string }[] = [];

	let score = 0, testCaseCnt = 0;

	if (testcases) {

		for (const testcase in testcases) {
			run_time = Math.max(run_time, testcases[testcase].time);
			memory = Math.max(memory, testcases[testcase].memory);
			status = Math.max(status, testcases[testcase].status);
			case_results.push({ case_name: testcase, run_time: testcases[testcase].time, memory: testcases[testcase].memory, status: testcases[testcase].status });
			testCaseCnt++;
		}

		for (const testset of testsetData.sort((a, b) => a.set_index - b.set_index)) {
			let status = JudgeStatus.WJ;
			let run_time = -1;
			let memory = -1;
			let set_score = 0, interactive = false;
			for (const testcase of testset.TestCaseUse) {
				const case_name = testcase.testcase.case_name;
				if (!testcases[case_name]) {
					run_time = -1;
					memory = -1;
					status = JudgeStatus.WJ;
					break;
				}
				run_time = Math.max(run_time, testcases[case_name].time);
				memory = Math.max(memory, testcases[case_name].memory);
				status = Math.max(status, testcases[case_name].status);
				if (testcases[case_name].score) {
					set_score += testcases[case_name].score;
					score += testcases[case_name].score;
					interactive = true;
				}
			}
			if (status == JudgeStatus.AC) {
				if (!interactive) {
					set_score += testset.score;
					score += testset.score;
				}
			}
			set_results.push({ set_name: testset.set_name, run_time, memory, status, score: set_score });
		}

	}

	if ([JudgeStatus.CE, JudgeStatus.IE, JudgeStatus.WJ, JudgeStatus.WR].includes(status)) {

		return { set_results, case_results, score, run_time, memory, status, display: JudgeStatus[status] };

	}

	return { set_results, case_results, score, run_time, memory, status: (testCaseCnt != testcaseData.length ? JudgeStatus.Judging : status), display: (testCaseCnt == testcaseData.length ? JudgeStatus[status] : (status == JudgeStatus.AC ? `${testCaseCnt} / ${testcaseData.length}` : `${JudgeStatus[status]} ${testCaseCnt} / ${testcaseData.length}`)) };

}

export type EvalSubmissionReturnType = Awaited<ReturnType<typeof evalSubmission>>
