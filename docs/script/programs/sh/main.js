export default async function(kernel, settings) {
	let exit = false;
	
	let splitLine = function(line) {
		let parsed = [];
		{
			const regex = /"([^"]*)"|([^"\s]+)/gm;
			let match = regex.exec(line);
			while(match) {
				parsed.push((match[2]) ? match[2] : match[1]);
				match = regex.exec(line);
			}
		}
		return parsed;
	}
	
	let parse = async function(line) {
		if(line === undefined) return;
		line = splitLine(line);
		if(line.length === 0) return;
		
		switch(line[0].toLowerCase()) {
			case "exit":
				exit = true;
				break;
				
			case "cd":
				let check = kernel.get_pathnode(line[1], settings.path);
				if(check && check instanceof Object) {
					settings.path = kernel.realpath(line[1], settings.path);
				} else {
					kernel.printf(`No folder named "${line[1]}"\n`);
				}
				break;
				
			default:
				{
					let prog_settings = {
						path: settings.path,
						argv: line
					}
					try {
						await kernel.exec(line[0], prog_settings);
					} catch(e) {
						if(e instanceof TypeError) kernel.puts(`shell: ${line[0]}: command not found`);
						else {
							kernel.puts(`shell: ${line[0]}: error in program; check console`);
							console.log(e);
						}
					}
				}
				break;
		}
	}
	
	//init
	kernel.puts("5hell started");
	while(!exit) {
		kernel.printf(`$ ${settings.path}> `);
		await parse(await kernel.getline());
	}
}