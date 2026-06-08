import { describe, expect, it } from "vitest";
import type { Problem, SolutionRequest, SolutionResponse } from "./types";

describe("solver types integration", () => {
	it("creates a complete SolutionRequest", () => {
		const problem: Problem = {
			title: "Two Sum",
			statement: "Given an array, return indices of two numbers that add up to target.",
			examples: [{ input: "[2,7,11,15], target=9", output: "[0,1]", explanation: "indices 0 and 1 sum to 9" }],
		};

		const request: SolutionRequest = {
			problem,
			explain: false,
		};

		expect(request.problem.title).toBe("Two Sum");
		expect(request.explain).toBe(false);
		expect(request.feedback).toBeUndefined();
	});

	it("creates a SolutionResponse", () => {
		const response: SolutionResponse = {
			code: "def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i",
			explanation: "Hash map approach, O(n) time, O(n) space.",
		};

		expect(response.code).toContain("def twoSum");
		expect(response.explanation).toContain("O(n)");
	});
});
