await kernel.output.printString("== 5shell ==\n");

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
