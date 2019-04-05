import BIOS from "./bios/main.js";

export function Kernel() {
	let self = this;
	let bios = new BIOS();
	
	//public
	self.getline = bios.input.getLine;
	self.puts = function(str) { bios.output.printAtCursor(`${str}\n`); }
	self.printf = bios.output.printAtCursor; //no need for doing our own substitutions, as JS already has its own
	self.exec = async function(prog_name, args = []) { //make sure to await if you don't want to fork
		await (await import(`../programs/${prog_name}/main.js`)).default(self, args);
	}
}

export default new Kernel();