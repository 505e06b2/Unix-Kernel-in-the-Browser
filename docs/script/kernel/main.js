import BIOS from "./bios/main.js";
import FS from "./filesystem.js";

export function Kernel() {
	const self = this;
	const bios = new BIOS();
	const fs = new FS();

	const startup_time = new Date();

	//public
	self.exit = function() { bios.output.exit(); }
	self.getuptime = function() { return (new Date()) - startup_time; }
	self.getline = bios.input.getLine;
	self.puts = function(str) { bios.output.printAtCursor(`${str}\n`); }
	self.printf = bios.output.printAtCursor; //no need for doing our own substitutions, as JS already has its own
	self.exec = async function(prog_name, prog_settings = null) { //make sure to await if you don't want to fork
		if(prog_settings === null) prog_settings = {
			path: "/",
			argv: []
		};
		await (await import(`../programs/${prog_name}/main.js`)).default(self, prog_settings);
	}

	self.remote_exec = async function(prog_url, prog_settings = null) {
		if(prog_settings === null) prog_settings = {
			path: "/",
			argv: []
		};

		bios.output.pause();

		let sandbox = new Kernel();
		sandbox.puts("[#] Sandboxing remote code...");
		await (await import(`${prog_url}`)).default(sandbox, prog_settings);
		sandbox.exit();

		bios.output.enterTextMode();

		self.puts("[#] Remote execution complete");
	}
	
	//filesystem stuff
	self.list_directory = function(path, abspath) {
		const p = fs.parse(path, abspath);
		if(p && p instanceof Object) return p;
		return null;
	}
	
	self.get_pathnode = fs.parse;
	self.realpath = fs.realpath;
	
	self.mkdir = function(str, abspath) {
		let node = fs.parse("", abspath);
		
		if(node instanceof Object && !node[str]) {
			node[str] = {};
			return true;
		} else {
			return false;
		}
	}
	
	self.mkfile = function(str, abspath, contents = "") {
		let node = fs.parse("", abspath);
		
		if(node instanceof Object && !node[str]) {
			node[str] = contents;
			return true;
		} else {
			return false;
		}
	}
	
	self.rm = function(str, abspath) {
		let path = fs.parse(str, abspath, true);
		path.pop();
		
		let rootfs = fs.rootfs;
		path.forEach(function(x) {
			rootfs = rootfs[x];
		});
		
		delete rootfs[str];
	}
	
	self.fs_info = function(occurences = {"files": 0, "folders": 0}, node = null) {
		if(node === null) node = fs.rootfs;
		
		for(let x in node) {
			if(node[x] instanceof Object) { //folder
				occurences.folders++;
				self.fs_info(occurences, node[x]);
			} else { //file
				occurences.files++;
			}
		}
		
		occurences.size = JSON.stringify(fs.rootfs).length *2; //utf-16 is at least 2 bytes, sometimes more, but my use-case will mostly be ASCII or extended UK ASCII at most
		
		return occurences;
	}
	
	self.export_fs = function() {
		window.localStorage.setItem("filesystem", fs.export());
		console.log("Synced Filesystem to localStorage");
	}
	
	self.import_fs = function() {
		const check = window.localStorage.getItem("filesystem");
		if(check) {
			fs.import(check);
			console.log("Cloned localStorage to memory");
			return true;
		} else {
			console.log("Attempted to clone localStorage (null)");
			return false;
		}
	}
}

export default new Kernel();
