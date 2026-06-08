import type { Component } from "@dotpp/tui";
import { Container, Input, Text } from "@dotpp/tui";
import type { Example } from "../solver/types.ts";

/**
 * A row representing a single input/output example with optional explanation.
 */
export class ExampleRow implements Component {
	private container: Container;
	private inputField: Input;
	private outputField: Input;
	private explanationField: Input;

	constructor(index: number) {
		this.container = new Container();
		this.inputField = new Input();
		this.outputField = new Input();
		this.explanationField = new Input();

		this.container.addChild(new Text(`Example ${index + 1}:`));
		this.container.addChild(new Text("  Input: "));
		this.container.addChild(this.inputField);
		this.container.addChild(new Text("  Output: "));
		this.container.addChild(this.outputField);
		this.container.addChild(new Text("  Explanation (optional): "));
		this.container.addChild(this.explanationField);
	}

	getData(): Example {
		const ex: Example = {
			input: this.inputField.getValue(),
			output: this.outputField.getValue(),
		};
		const explanation = this.explanationField.getValue();
		if (explanation) {
			ex.explanation = explanation;
		}
		return ex;
	}

	focus(): void {
		this.inputField.focused = true;
	}

	render(width: number): string[] {
		return this.container.render(width);
	}

	handleInput(data: string): void {
		if (this.inputField.focused) {
			this.inputField.handleInput(data);
		} else if (this.outputField.focused) {
			this.outputField.handleInput(data);
		} else if (this.explanationField.focused) {
			this.explanationField.handleInput(data);
		}
	}

	invalidate(): void {
		this.container.invalidate();
	}
}
