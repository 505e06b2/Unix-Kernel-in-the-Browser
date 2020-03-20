const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

let pid_counter = 0;

function Process(_kernel) {
	this.run = async (process, argv) => {
		if(!process) {
			this.cwd = "/";
			this.path = "/bin";
		} else {
			this.cwd = process.cwd;
			this.path = process.path;
		}
		this.pid = pid_counter++;

		if(argv[0][0] !== "." && argv[0][0] !== "/") {
			argv[0] = `${this.path}/${argv[0]}`; //REPLACE WITH A WORKING PATH CHECK
		}

		const exec_path = await _kernel.fs.resolve(this, argv[0]);

		const script_contents = await _kernel.fs.read(exec_path);

		if(typeof script_contents !== "string") {
			await _kernel.output.printString(`${exec_path} is not a file\n`);
			return 1;
		}

		return await new AsyncFunction("const kernel = arguments[0]; const process = arguments[1]; const argv = arguments[2] \n" + script_contents)
			(_kernel, this, argv);
	}

	this.chdir = async (path) => {
		if(typeof (await _kernel.fs.listdir(path)) !== "undefined") {
			this.cwd = path;
			console.log(`Change dir: ${this.cwd}`);
		}
	}
}

export default function(_kernel) {
	this.execute = async (process, argv) => {
		if(typeof argv === "string") argv = [argv];
		return await (new Process(_kernel)).run(process, argv);
	};

	this.init = async () => {
		await this.execute(null, "/init");
		await _kernel.output.printString("!KERNEL PANIC! PID0 HAS EXITED");
	};
}
