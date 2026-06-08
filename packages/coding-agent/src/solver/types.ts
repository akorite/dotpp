/**
 * A single input/output example for a competitive programming problem.
 * The optional explanation field gives the LLM semantic understanding
 * of *why* the output follows from the input.
 */
export interface Example {
	/** The input data for this test case */
	input: string;
	/** The expected output for this test case */
	output: string;
	/** Optional explanation of why this output follows from the input */
	explanation?: string;
}

/**
 * A competitive programming problem with structured fields.
 */
export interface Problem {
	/** The problem title (e.g., "Two Sum") */
	title: string;
	/** The full problem statement */
	statement: string;
	/** One or more input/output examples */
	examples: Example[];
}

/**
 * Request to solve a problem. Wraps the problem with solver configuration
 * and optional conversation history for multi-turn iteration.
 */
export interface SolutionRequest {
	/** The problem to solve */
	problem: Problem;
	/** Whether to include an approach explanation alongside the code */
	explain: boolean;
	/** Optional feedback from previous attempts for iteration */
	feedback?: string;
}

/**
 * The LLM's response to a solution request.
 */
export interface SolutionResponse {
	/** The complete, runnable solution code */
	code: string;
	/** Optional explanation of the approach (when explain mode is on) */
	explanation?: string;
}
