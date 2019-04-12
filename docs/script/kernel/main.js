import BIOS from "./bios/main.js";
import FS from "./filesystem.js";

export function Kernel() {
	let self = this;
	let bios = new BIOS();
	let fs = new FS();

	let startup_time = new Date();

	//public
	self.exit = function() { bios.output.exit(); }
	self.getuptime = function() { return (new Date()) - startup_time; }
	self.getline = bios.input.getLine;
	self.puts = function(str) { bios.output.printAtCursor(`${str}\n`); }
	self.printf = bios.output.printAtCursor; //no need for doing our own substitutions, as JS already has its own
	self.exec = async function(prog_name, prog_settings = {}) { //make sure to await if you don't want to fork
		const {
			path = "/",
			argv = []
		} = prog_settings;
		await (await import(`../programs/${prog_name}/main.js`)).default(self, prog_settings);
	}

	self.remote_exec = async function(prog_url, prog_settings = {}) {
		const {
			path = "/",
			argv = []
		} = prog_settings;

		bios.output.pause();

		let sandbox = new Kernel();
		sandbox.puts("[#] Sandboxing remote code...");
		await (await import(`${prog_url}`)).default(sandbox, prog_settings);
		sandbox.exit();

		bios.output.enterTextMode();

		self.puts("[#] Remote execution complete");
	}
}

export default new Kernel();
