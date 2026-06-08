import { type Api, type Context, complete, type Model } from "@dotpp/ai";
import { codeOnlyPrompt, codeWithExplanationPrompt, extractCode, feedbackPrompt } from "./prompt.ts";
import type { Problem, SolutionRequest, SolutionResponse } from "./types.ts";

/**
 * Solve a problem using the LLM.
 * Returns the solution response with code (and optionally explanation).
 */
export async function solve(request: SolutionRequest, model: Model<Api>): Promise<SolutionResponse> {
	const prompt = request.explain ? codeWithExplanationPrompt(request.problem) : codeOnlyPrompt(request.problem);

	const context: Context = {
		systemPrompt: prompt,
		messages: [
			{
				role: "user",
				content: "Solve this problem.",
				timestamp: Date.now(),
			},
		],
	};

	const response = await complete(model, context);
	const text = response.content
		.filter((c): c is { type: "text"; text: string } => c.type === "text")
		.map((c) => c.text)
		.join("");

	const code = extractCode(text);

	if (request.explain) {
		// Split code and explanation
		const explanationMatch = text.match(/```[\s\S]*?```\s*\n([\s\S]*)/);
		return {
			code,
			explanation: explanationMatch?.[1]?.trim() || undefined,
		};
	}

	return { code };
}

/**
 * Solve with feedback (multi-turn iteration).
 */
export async function solveWithFeedback(
	problem: Problem,
	feedback: string,
	explain: boolean,
	model: Model<Api>,
): Promise<SolutionResponse> {
	const prompt = feedbackPrompt(problem, feedback, explain);

	const context: Context = {
		systemPrompt: prompt,
		messages: [
			{
				role: "user",
				content: "Revise your solution based on the feedback.",
				timestamp: Date.now(),
			},
		],
	};

	const response = await complete(model, context);
	const text = response.content
		.filter((c): c is { type: "text"; text: string } => c.type === "text")
		.map((c) => c.text)
		.join("");

	const code = extractCode(text);

	if (explain) {
		const explanationMatch = text.match(/```[\s\S]*?```\s*\n([\s\S]*)/);
		return {
			code,
			explanation: explanationMatch?.[1]?.trim() || undefined,
		};
	}

	return { code };
}
