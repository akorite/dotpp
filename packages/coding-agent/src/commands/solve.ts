import type { Api, Model } from "@dotpp/ai";
import { ProcessTerminal, TUI } from "@dotpp/tui";
import chalk from "chalk";
import { ProblemForm } from "../forms/problem-form";
import { solve, solveWithFeedback } from "../solver/index";
import type { Problem, SolutionRequest, SolutionResponse } from "../solver/types";

interface SolveOptions {
	/** Enable explanation mode by default */
	explain?: boolean;
	/** The model to use for solving */
	model?: Model<Api>;
}

/**
 * Run the interactive solve command.
 * Presents a TUI form for entering a problem, then calls the LLM to solve it.
 */
export async function runSolve(options: SolveOptions = {}): Promise<void> {
	const ui = new TUI(new ProcessTerminal());

	// Create and show the form
	const form = new ProblemForm();
	ui.addChild(form);

	// Wait for form submission
	const problem = await new Promise<Problem>((resolve) => {
		form.onSubmit_((p) => {
			ui.stop();
			resolve(p);
		});
		form.onEscape_(() => {
			ui.stop();
			process.exit(0);
		});
	});

	// Show problem summary
	console.log(chalk.cyan("\n=== Problem ==="));
	console.log(chalk.bold(problem.title));
	console.log(problem.statement);
	if (problem.examples.length > 0) {
		console.log(chalk.gray(`\n${problem.examples.length} example(s) provided`));
	}

	// Solve
	console.log(chalk.cyan("\nSolving...\n"));

	const request: SolutionRequest = {
		problem,
		explain: options.explain ?? false,
	};

	try {
		// For now, we need a model. In a real implementation, this would come from
		// the model registry. For the MVP, we'll use a placeholder.
		if (!options.model) {
			console.log(chalk.red("No model configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY."));
			process.exit(1);
		}

		const response = await solve(request, options.model);
		displaySolution(response);

		// Offer iteration
		await offerIteration(problem, response, options);
	} catch (error) {
		console.error(chalk.red("Error solving problem:"), error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

/**
 * Display the solution to the terminal.
 */
function displaySolution(response: SolutionResponse): void {
	console.log(chalk.green("=== Solution ==="));
	console.log(response.code);

	if (response.explanation) {
		console.log(chalk.yellow("\n=== Explanation ==="));
		console.log(response.explanation);
	}
}

/**
 * Offer the user a chance to provide feedback and iterate.
 */
async function offerIteration(problem: Problem, _previous: SolutionResponse, options: SolveOptions): Promise<void> {
	const readline = await import("node:readline");
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const answer = await new Promise<string>((resolve) => {
		rl.question(chalk.cyan("\nProvide feedback? (y/n): "), resolve);
	});

	rl.close();

	if (answer.toLowerCase() !== "y" && answer.toLowerCase() !== "yes") {
		return;
	}

	const feedback = await new Promise<string>((resolve) => {
		const rl2 = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl2.question(chalk.cyan("Feedback: "), (ans) => {
			rl2.close();
			resolve(ans);
		});
	});

	if (!feedback.trim()) {
		return;
	}

	console.log(chalk.cyan("\nRevising...\n"));

	try {
		if (!options.model) {
			console.log(chalk.red("No model configured."));
			return;
		}

		const response = await solveWithFeedback(problem, feedback, options.explain ?? false, options.model);
		displaySolution(response);

		// Offer another iteration
		await offerIteration(problem, response, options);
	} catch (error) {
		console.error(chalk.red("Error revising solution:"), error instanceof Error ? error.message : error);
	}
}
