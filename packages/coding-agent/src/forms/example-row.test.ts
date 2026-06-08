import { describe, expect, it } from "vitest";
import { ExampleRow } from "./example-row";

describe("ExampleRow", () => {
	it("creates a row with index", () => {
		const row = new ExampleRow(0);
		expect(row).toBeDefined();
	});

	it("returns empty example when no input", () => {
		const row = new ExampleRow(0);
		const data = row.getData();
		expect(data.input).toBe("");
		expect(data.output).toBe("");
		expect(data.explanation).toBeUndefined();
	});

	it("renders without crashing", () => {
		const row = new ExampleRow(0);
		const lines = row.render(80);
		expect(lines.length).toBeGreaterThan(0);
	});

	it("handles input without crashing", () => {
		const row = new ExampleRow(0);
		row.handleInput("test");
	});

	it("invalidates without crashing", () => {
		const row = new ExampleRow(0);
		row.invalidate();
	});
});
