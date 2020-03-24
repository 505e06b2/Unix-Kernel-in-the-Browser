const list = await kernel.fs.listdir(await kernel.fs.resolve(process, (argv[1]) ? argv[1] : "."));

if(list !== undefined) {
	for(let i = 0; i < list.length; i++) {
		await kernel.output.printString(list[i] + "\n");
	}
} else {
	await kernel.output.printString(`${argv[1]} is not a directory\n`);
}
