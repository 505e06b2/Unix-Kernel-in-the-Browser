import Output from "./output.js";
import Input from "./input.js";

export default function() {
	this.output = new Output("main", "overlay");
	this.input = new Input(this.output);
	this.output.enterTextMode();
}