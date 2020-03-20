import module_output from "./modules/output.js";
import module_input from "./modules/input.js";
import module_fs from "./modules/filesystem.js";
import module_proc from "./modules/processes.js";

export default function Kernel(_output_container) {
	//init
	this.output = new module_output(this, _output_container);
	this.input = new module_input(this);
	this.fs = new module_fs(this);
	this.proc = new module_proc(this);

	this.proc.init();
}
