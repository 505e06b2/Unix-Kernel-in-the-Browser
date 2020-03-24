const file_contents = await kernel.fs.read(await kernel.fs.resolve(process, argv[1]));

if(file_contents !== undefined) {
	await kernel.output.printString(file_contents + "\n");
} else {
	await kernel.output.printString(`${argv[1]} is not a file\n`);
}
