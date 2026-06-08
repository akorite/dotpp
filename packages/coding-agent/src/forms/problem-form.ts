import type { Component, Focusable } from "@dotpp/tui";
import { Container, Input, Text } from "@dotpp/tui";
import type { Problem } from "../solver/types";
import { ExampleRow } from "./example-row";

/**
 * Interactive TUI form for entering competitive programming problems.
 *
 * Layout:
 *   Title: [single-line input]
 *   Problem Statement:
 *   [multi-line input area]
 *   Examples:
 *   [Example 1: input/output/explanation]
 *   [Example 2: ...]
 *   [+ Add Example] [Submit]
 */
export class ProblemForm implements Component, Focusable {
	private container: Container;
	private titleField: Input;
	private statementField: Input;
	private examples: ExampleRow[] = [];
	private exampleContainer: Container;
	private footerContainer: Container;
	private onSubmit?: (problem: Problem) => void;
	private onEscape?: () => void;
	focused: boolean = true;

	constructor() {
		this.container = new Container();
		this.titleField = new Input();
		this.statementField = new Input();
		this.exampleContainer = new Container();
		this.footerContainer = new Container();

		// Build the form layout
		this.container.addChild(new Text("=== Competitive Programming Problem ==="));
		this.container.addChild(new Text(""));
		this.container.addChild(new Text("Title:"));
		this.container.addChild(this.titleField);
		this.container.addChild(new Text(""));
		this.container.addChild(new Text("Problem Statement:"));
		this.container.addChild(this.statementField);
		this.container.addChild(new Text(""));

		// Examples section
		this.container.addChild(new Text("Examples (press Enter to add more):"));
		this.container.addChild(this.exampleContainer);

		// Add first empty example
		this.addExample();

		// Footer
		this.container.addChild(new Text(""));
		this.container.addChild(new Text("Press Ctrl+Enter to submit, Escape to cancel"));
		this.container.addChild(this.footerContainer);

		// Wire up callbacks
		this.titleField.onSubmit = () => {
			this.statementField.focused = true;
			this.titleField.focused = false;
		};

		this.statementField.onSubmit = () => {
			this.submit();
		};

		this.titleField.onEscape = () => this.onEscape?.();
		this.statementField.onEscape = () => this.onEscape?.();
	}

	/** Set callback for when the form is submitted */
	onSubmit_(callback: (problem: Problem) => void): void {
		this.onSubmit = callback;
	}

	/** Set callback for when the form is cancelled */
	onEscape_(callback: () => void): void {
		this.onEscape = callback;
	}

	/** Add a new example row */
	private addExample(): void {
		const row = new ExampleRow(this.examples.length);
		this.examples.push(row);
		this.exampleContainer.addChild(row);
	}

	/** Collect all form data into a Problem object */
	getData(): Problem {
		const examples = this.examples.map((row) => row.getData()).filter((ex) => ex.input || ex.output); // Filter empty examples

		return {
			title: this.titleField.getValue(),
			statement: this.statementField.getValue(),
			examples,
		};
	}

	/** Submit the form */
	private submit(): void {
		const problem = this.getData();
		if (!problem.title || !problem.statement) {
			// Don't submit if title or statement is empty
			return;
		}
		this.onSubmit?.(problem);
	}

	render(width: number): string[] {
		return this.container.render(width);
	}

	handleInput(data: string): void {
		if (this.titleField.focused) {
			this.titleField.handleInput(data);
		} else if (this.statementField.focused) {
			this.statementField.handleInput(data);
		}
	}

	invalidate(): void {
		this.container.invalidate();
	}
}
