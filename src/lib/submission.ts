import { JudgeStatus } from "@atsuo-tech/atsuo-coder-v3-prisma";
import atsuocoder_db from "./atsuocoder_db";
import type { Prisma } from "@atsuo-tech/atsuo-coder-v3-prisma";

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

export const evaluatableSubmissionIncluder = {
	language: {
		select: {
			name: true,
		},
	},
	contest: {
		select: {
			url_id: true,
			TaskUse: {
				select: {
					assignment: true,
					taskUnique_id: true,
				},
			},
		},
	},
	task: {
		select: {
			url_id: true,
			title: true,
		},
	},
	judgeResults: {
		select: {
			status: true,
			time: true,
			memory: true,
			error_type: true,
			server_id: true,
			score: true,
			testCase: {
				select: {
					unique_id: true,
					case_name: true,
				},
			},
		},
	},
};

export async function getEvaluatableSubmission(unique_id: string) {

	return atsuocoder_db.submission.findUnique({
		where: {
			unique_id,
		},
		include: evaluatableSubmissionIncluder,
	});

}

export type GetEvaluatableSubmissionType = Exclude<Awaited<ReturnType<typeof getEvaluatableSubmission>>, null>;

export async function evalSubmission(submission: GetEvaluatableSubmissionType) {

	if (submission.judgeResults.length == 0) {

		return {
			set_results: [],
			case_results: [],
			score: 0,
			run_time: -1,
			memory: -1,
			status: submission.status,
			display: JudgeStatus[submission.status],
		};

	}

	const testcases = submission.judgeResults;

	let run_time = -1;
	let memory = -1;
	let status: JudgeStatus = JudgeStatus.WJ;

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

	const set_results: { status: JudgeStatus, run_time: number, memory: number, set_name: string, score: number, testcase: string[] }[] = [];
	const case_results: { status: JudgeStatus, run_time: number, memory: number, case_name: string, error_type?: string }[] = [];

	let score = 0, testCaseCnt = 0;

	const judgeStatusValues = Object.values(JudgeStatus);

	if (testcases) {

		for (const testcase of testcases) {
			run_time = Math.max(run_time, Number(testcase.time));
			memory = Math.max(memory, Number(testcase.memory));
			if (judgeStatusValues.indexOf(status) < judgeStatusValues.indexOf(testcase.status)) {
				status = testcase.status;
			}
			case_results.push({ case_name: testcase.testCase.case_name, run_time: Number(testcase.time), memory: Number(testcase.memory), status: testcase.status, error_type: testcase.error_type || undefined });
			testCaseCnt++;
		}

		for (const testset of testsetData.sort((a, b) => a.set_index - b.set_index)) {
			let status: JudgeStatus = JudgeStatus.WJ;
			let run_time = -1;
			let memory = -1;
			let set_score = 0, interactive = false;
			const set_testcase: string[] = [];
			for (const testcase of testset.TestCaseUse) {
				set_testcase.push(testcase.testcase.case_name);
				const case_name = testcase.testcase.case_name;
				if (!testcase) {
					run_time = -1;
					memory = -1;
					status = JudgeStatus.WJ;
					break;
				}
				const testcaseResult = testcases.find((tc) => tc.testCase.case_name == case_name);
				if (!testcaseResult) {
					continue;
				}
				run_time = Math.max(run_time, Number(testcaseResult.time));
				memory = Math.max(memory, Number(testcaseResult.memory));
				if (judgeStatusValues.indexOf(status) < judgeStatusValues.indexOf(testcaseResult.status)) {
					status = testcaseResult.status;
				}
				if (testcaseResult.score !== undefined) {
					set_score += Number(testcaseResult.score);
					score += Number(testcaseResult.score);
					interactive = true;
				}
			}
			if (status == JudgeStatus.AC) {
				if (!interactive) {
					set_score += Number(testset.score);
					score += Number(testset.score);
				}
			}
			set_results.push({ set_name: testset.set_name, run_time, memory, status, score: set_score, testcase: set_testcase });
		}

	}

	if (([JudgeStatus.CE, JudgeStatus.IE, JudgeStatus.WJ, JudgeStatus.WR] as JudgeStatus[]).includes(status)) {

		return { set_results, case_results, score, run_time, memory, status, display: JudgeStatus[status] };

	}

	return { set_results, case_results, score, run_time, memory, status: (testCaseCnt != testcaseData.length ? JudgeStatus.Judging : status), display: (testCaseCnt == testcaseData.length ? JudgeStatus[status] : (status == JudgeStatus.AC ? `${testCaseCnt} / ${testcaseData.length}` : `${JudgeStatus[status]} ${testCaseCnt} / ${testcaseData.length}`)) };

}

export type EvalSubmissionReturnType = Awaited<ReturnType<typeof evalSubmission>>

export async function getSubmissions(pageInt: number, where?: Prisma.SubmissionWhereInput, orderBy?: Prisma.SubmissionOrderByWithRelationInput) {

	return await atsuocoder_db.submission.findMany({
		where,
		include: evaluatableSubmissionIncluder,
		orderBy: {
			created_at: 'desc',
			...orderBy,
		},
		skip: pageInt * 20,
		take: 21,
	});

}
