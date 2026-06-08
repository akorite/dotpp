import { describe, expect, it } from "vitest";
import { ProblemForm } from "./problem-form.ts";

describe("ProblemForm", () => {
	it("creates a form with default fields", () => {
		const form = new ProblemForm();
		expect(form).toBeDefined();
		expect(form.focused).toBe(true);
	});

	it("collects data from form fields", () => {
		const form = new ProblemForm();
		const data = form.getData();
		expect(data.title).toBe("");
		expect(data.statement).toBe("");
		expect(data.examples).toHaveLength(0);
	});

	it("renders without crashing", () => {
		const form = new ProblemForm();
		const lines = form.render(80);
		expect(lines.length).toBeGreaterThan(0);
	});

	it("handles input without crashing", () => {
		const form = new ProblemForm();
		form.handleInput("a");
		form.handleInput("b");
		// No assertion needed — just verify no crash
	});

	it("invalidates without crashing", () => {
		const form = new ProblemForm();
		form.invalidate();
		// No assertion needed — just verify no crash
	});
});
