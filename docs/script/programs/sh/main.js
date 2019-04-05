export default async function(kernel, args) {
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
		line = splitLine(line);
		if(line.length == 0) return;
		
		switch(line[0].toLowerCase()) {
			case "exit":
				exit = true;
				break;
				
			default:
				{
					let name = line.shift();
					try {
						await kernel.exec(name, line);
					} catch(e) {
						if(e instanceof TypeError) kernel.puts(`shell: ${name}: command not found`);
						else {
							kernel.puts(`shell: ${name}: error in program; check console`);
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
		kernel.printf("$> ");
		await parse(await kernel.getline());
	}
}