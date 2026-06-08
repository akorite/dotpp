import { describe, expect, it } from "vitest";
import { codeOnlyPrompt, codeWithExplanationPrompt, extractCode, feedbackPrompt } from "./prompt.ts";
import type { Problem } from "./types.ts";

const twoSum: Problem = {
	title: "Two Sum",
	statement: "Given an array of integers and a target, return indices of two numbers that add up to target.",
	examples: [
		{ input: "[2,7,11,15], target=9", output: "[0,1]", explanation: "indices 0 and 1 sum to 9" },
		{ input: "[3,2,4], target=6", output: "[1,2]" },
	],
};

const emptyProblem: Problem = {
	title: "Empty",
	statement: "No examples.",
	examples: [],
};

describe("codeOnlyPrompt", () => {
	it("includes problem title and statement", () => {
		const prompt = codeOnlyPrompt(twoSum);
		expect(prompt).toContain("# Two Sum");
		expect(prompt).toContain("Given an array of integers");
	});

	it("includes examples with explanations", () => {
		const prompt = codeOnlyPrompt(twoSum);
		expect(prompt).toContain("Example 1");
		expect(prompt).toContain("[2,7,11,15], target=9");
		expect(prompt).toContain("indices 0 and 1 sum to 9");
		expect(prompt).toContain("Example 2");
	});

	it("does not include explanation instructions", () => {
		const prompt = codeOnlyPrompt(twoSum);
		expect(prompt).not.toContain("Time and space complexity");
		expect(prompt).not.toContain("explanation of your approach");
	});

	it("works with empty examples", () => {
		const prompt = codeOnlyPrompt(emptyProblem);
		expect(prompt).toContain("# Empty");
		expect(prompt).not.toContain("## Examples");
	});
});

describe("codeWithExplanationPrompt", () => {
	it("includes explanation instructions", () => {
		const prompt = codeWithExplanationPrompt(twoSum);
		expect(prompt).toContain("Time and space complexity");
		expect(prompt).toContain("explanation of your approach");
		expect(prompt).toContain("Key insights");
	});

	it("produces a different prompt than code-only", () => {
		const codeOnly = codeOnlyPrompt(twoSum);
		const withExplanation = codeWithExplanationPrompt(twoSum);
		expect(withExplanation.length).toBeGreaterThan(codeOnly.length);
	});
});

describe("feedbackPrompt", () => {
	it("includes feedback in the prompt", () => {
		const prompt = feedbackPrompt(twoSum, "Use a hash map", false);
		expect(prompt).toContain("Use a hash map");
		expect(prompt).toContain("Previous Feedback");
	});

	it("uses code-only base when explain is false", () => {
		const prompt = feedbackPrompt(twoSum, "Try again", false);
		expect(prompt).not.toContain("Time and space complexity");
	});

	it("uses explanation base when explain is true", () => {
		const prompt = feedbackPrompt(twoSum, "Try again", true);
		expect(prompt).toContain("Time and space complexity");
	});
});

describe("extractCode", () => {
	it("extracts code from markdown code block", () => {
		const response = "```python\ndef solve(n):\n    return n\n```";
		const code = extractCode(response);
		expect(code).toBe("def solve(n):\n    return n");
	});

	it("extracts code from code block with language tag", () => {
		const response = "```cpp\n#include <iostream>\nint main() { return 0; }\n```";
		const code = extractCode(response);
		expect(code).toBe("#include <iostream>\nint main() { return 0; }");
	});

	it("returns raw response when no code block", () => {
		const response = "def solve(n):\n    return n";
		const code = extractCode(response);
		expect(code).toBe("def solve(n):\n    return n");
	});

	it("handles multiple code blocks (takes first)", () => {
		const response = "```python\ndef first():\n    pass\n```\n\n```python\ndef second():\n    pass\n```";
		const code = extractCode(response);
		expect(code).toContain("def first()");
	});
});
