export default function(_kernel) {
	this.resolve = async (process, path) => {
		let split_path = path.split("/");

		if(path[0] === ".") {
			split_path = process.cwd.split("/").concat(split_path);
		}

		let resolved_path = [];
		for(let i = 0; i < split_path.length; i++) {
			let str = split_path[i];
			if(str === "..") resolved_path.pop();
			else if(str && str !== ".") resolved_path.push(str);
		}

		return "/" + resolved_path.join("/");
	}

	this.read = async (path) => { //must be absolute
		if(path[0] !== "/") throw "Paths must be absolute";

		const resolved = path.slice(1).split("/"); //remove the first "/"
		let current_node = this.files;
		for(let i = 0; i < resolved.length; i++) {
			current_node = current_node[resolved[i]];
		}
		if(typeof current_node !== "string") return undefined;
		return current_node;
	}

	this.listdir = async (path) => { //must be absolute
		if(path[0] !== "/") throw "Paths must be absolute";

		const resolved = path.split("/"); //remove the first "/"
		let current_node = this.files;
		for(let i = 0; i < resolved.length; i++) {
			if(resolved[i]) current_node = current_node[resolved[i]];
		}
		if(typeof current_node !== "object") return undefined;
		return Object.keys(current_node);
	}

	this.init = async () => {
		this.files = {
			"bin": {
				"sh": await (await fetch("./kernel/bin/sh.js")).text(),
				"ls": await (await fetch("./kernel/bin/ls.js")).text(),
				"pwd": await (await fetch("./kernel/bin/pwd.js")).text(),
				"cat": await (await fetch("./kernel/bin/cat.js")).text()
			},
			"init": `await kernel.output.printString("Init Loaded...\\n"); await kernel.proc.execute(process, "/bin/sh")`
		};
	}
}
