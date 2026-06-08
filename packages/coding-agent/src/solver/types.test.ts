import { describe, expect, it } from "vitest";
import type { Example, Problem, SolutionRequest, SolutionResponse } from "./types.ts";

describe("Example", () => {
	it("creates an example with explanation", () => {
		const ex: Example = {
			input: "[2,7,11,15], target=9",
			output: "[0,1]",
			explanation: "indices 0 and 1 sum to 9",
		};
		expect(ex.input).toBe("[2,7,11,15], target=9");
		expect(ex.output).toBe("[0,1]");
		expect(ex.explanation).toBe("indices 0 and 1 sum to 9");
	});

	it("creates an example without explanation", () => {
		const ex: Example = {
			input: "[3,2,4], target=6",
			output: "[1,2]",
		};
		expect(ex.explanation).toBeUndefined();
	});
});

describe("Problem", () => {
	it("creates a problem with multiple examples", () => {
		const problem: Problem = {
			title: "Two Sum",
			statement: "Given an array of integers and a target, return indices of two numbers that add up to target.",
			examples: [
				{ input: "[2,7,11,15], target=9", output: "[0,1]", explanation: "indices 0 and 1 sum to 9" },
				{ input: "[3,2,4], target=6", output: "[1,2]" },
			],
		};
		expect(problem.title).toBe("Two Sum");
		expect(problem.examples).toHaveLength(2);
		expect(problem.examples[0].explanation).toBeDefined();
		expect(problem.examples[1].explanation).toBeUndefined();
	});

	it("creates a problem with no examples (statement-only)", () => {
		const problem: Problem = {
			title: "Empty Problem",
			statement: "Just a statement.",
			examples: [],
		};
		expect(problem.examples).toHaveLength(0);
	});

	it("handles very long statement", () => {
		const longStatement = "x".repeat(10000);
		const problem: Problem = {
			title: "Long",
			statement: longStatement,
			examples: [],
		};
		expect(problem.statement).toHaveLength(10000);
	});
});

describe("SolutionRequest", () => {
	it("creates a request with explanation mode off", () => {
		const req: SolutionRequest = {
			problem: { title: "Test", statement: "Do something", examples: [] },
			explain: false,
		};
		expect(req.explain).toBe(false);
		expect(req.feedback).toBeUndefined();
	});

	it("creates a request with feedback", () => {
		const req: SolutionRequest = {
			problem: { title: "Test", statement: "Do something", examples: [] },
			explain: true,
			feedback: "Use a two-pointer approach instead",
		};
		expect(req.feedback).toBe("Use a two-pointer approach instead");
	});
});

describe("SolutionResponse", () => {
	it("creates a response with code only", () => {
		const res: SolutionResponse = {
			code: "def solve(n): return n",
		};
		expect(res.explanation).toBeUndefined();
	});

	it("creates a response with code and explanation", () => {
		const res: SolutionResponse = {
			code: "def solve(n): return n",
			explanation: "Linear scan approach, O(n) time, O(1) space.",
		};
		expect(res.explanation).toContain("O(n)");
	});
});
