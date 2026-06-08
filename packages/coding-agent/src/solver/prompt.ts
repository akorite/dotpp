import type { Problem } from "./types.ts";

/**
 * Format a Problem into a prompt-ready string for the LLM.
 */
function formatProblem(problem: Problem): string {
	const parts: string[] = [];

	parts.push(`# ${problem.title}`);
	parts.push("");
	parts.push(problem.statement);

	if (problem.examples.length > 0) {
		parts.push("");
		parts.push("## Examples");
		for (const [i, ex] of problem.examples.entries()) {
			parts.push("");
			parts.push(`### Example ${i + 1}`);
			parts.push("");
			parts.push(`Input: ${ex.input}`);
			parts.push(`Output: ${ex.output}`);
			if (ex.explanation) {
				parts.push(`Explanation: ${ex.explanation}`);
			}
		}
	}

	return parts.join("\n");
}

/**
 * Generate the system prompt for code-only mode.
 */
export function codeOnlyPrompt(problem: Problem): string {
	return `You are an expert competitive programmer. Solve the following problem.

Return ONLY the complete, runnable solution code. Do not include explanations, test cases, or commentary.

Write the solution in the most appropriate language for the problem (Python, C++, Java, etc.). If the examples imply a specific language, use that.

${formatProblem(problem)}`;
}

/**
 * Generate the system prompt for code-with-explanation mode.
 */
export function codeWithExplanationPrompt(problem: Problem): string {
	return `You are an expert competitive programmer. Solve the following problem.

Return the complete, runnable solution code, followed by:
1. A brief explanation of your approach
2. Time and space complexity analysis (Big-O notation)
3. Key insights or edge cases considered

Write the solution in the most appropriate language for the problem (Python, C++, Java, etc.). If the examples imply a specific language, use that.

${formatProblem(problem)}`;
}

/**
 * Generate a follow-up prompt when the user provides feedback.
 */
export function feedbackPrompt(problem: Problem, feedback: string, explain: boolean): string {
	const base = explain ? codeWithExplanationPrompt(problem) : codeOnlyPrompt(problem);

	return `${base}

## Previous Feedback

${feedback}

Please revise your solution based on this feedback.`;
}

/**
 * Extract code from an LLM response, handling markdown code blocks.
 */
export function extractCode(response: string): string {
	// Try to extract from markdown code block
	const codeBlockMatch = response.match(/```(?:\w+)?\n([\s\S]*?)```/);
	if (codeBlockMatch) {
		return codeBlockMatch[1].trim();
	}

	// If no code block found, return the raw response
	return response.trim();
}
