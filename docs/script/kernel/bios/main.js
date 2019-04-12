import Output from "./output.js";
import Input from "./input.js";

export default function() {
	this.output = new Output("main", "overlay");
	this.input = new Input(this.output);
	
	this.output.elem.onfocus = function() {
		//this.blur();
	}
	
	this.output.elem.oncut = function(e) {
		e.stopPropagation();
		e.preventDefault();
		document.execCommand("copy");
	}
	
	this.output.elem.onpaste = function(e) {
		// Stop data actually being pasted into div
		e.stopPropagation();
		e.preventDefault();
		
		for(let x of (e.clipboardData || window.clipboardData).getData('Text')) {
			window.onkeydown( new KeyboardEvent("keydown", {key: x}) );
		}
	}
	this.output.enterTextMode();
}