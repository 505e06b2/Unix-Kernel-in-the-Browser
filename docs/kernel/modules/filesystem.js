const default_bin = {

"bash":
`
	await kernel.output.printString("== 5shell ==\\n");
	while(true) {
		await kernel.output.printString(process.cwd + "# ");
		let argv = (await kernel.input.getLine()).slice(0,-1).split(" "); //remove newline

		switch(argv[0]) {
			case "":
				continue;

			case "cd":
				if(argv[1]) await process.chdir(await kernel.fs.resolve(process, argv[1]));
				continue;

			case "exit":
				if(argv[1] && parseInt(argv[1])) return parseInt(argv[1]);
				return 0;
		}

		await kernel.proc.execute(process, argv);
	}
`,

"ls":
`
	const list = await kernel.fs.listdir(await kernel.fs.resolve(process, (argv[1]) ? argv[1] : "."));
	if(!list) return;
	for(let i = 0; i < list.length; i++) {
		await kernel.output.printString(list[i] + "\\n");
	}
`
};

const default_files = {
	"bin": default_bin,
	"init": `await kernel.output.printString("Init Loaded...\\n"); await kernel.proc.execute(process, "/bin/bash")`
};

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
		if(path[0] !== "/") {
			throw "Paths must be absolute";
		}

		const resolved = path.slice(1).split("/"); //remove the first "/"
		let current_node = this.files;
		for(let i = 0; i < resolved.length; i++) {
			current_node = current_node[resolved[i]];
		}
		return current_node;
	}

	this.listdir = async (path) => { //must be absolute
		if(path[0] !== "/") {
			throw "Paths must be absolute";
		}

		const resolved = path.split("/"); //remove the first "/"
		let current_node = this.files;
		for(let i = 0; i < resolved.length; i++) {
			if(resolved[i]) current_node = current_node[resolved[i]];
		}

		if(typeof current_node === "object") {
			return Object.keys(current_node);
		} else {
			await _kernel.output.printString(`${path} is not a directory\n`);
			return undefined;
		}

	}

	this.files = default_files; //doesn't matter if shallow merge, as nothing to replace
}
