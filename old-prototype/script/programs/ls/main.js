function sortAll(a, b) {
	if(a > b) return 1;
	if(a < b) return -1;

	return 0;
}

function sortFolders(a, b) {
	return sortAll(a.toUpperCase(), b.toUpperCase());
}

function sortFiles(afile, bfile) {
	return sortAll(afile.name.toUpperCase(), bfile.name.toUpperCase());
}

export default async function(kernel, settings) {
	const path = (settings.argv[1]) ? settings.argv[1] : settings.path;
	const contents = {"file_info": [], "folder_info": []};

	const node = kernel.list_directory(path, settings.path);

	for(let x in node) {
		if(node[x] instanceof Object) {
			contents.folder_info.push(x);
		} else {
			contents.file_info.push({"name": x, "size": node[x].length*2}); //POSSIBLY MAKE A STAT
		}
	}

	contents.folder_info.sort(sortFolders);
	contents.file_info.sort(sortFiles);

	contents.folder_info.forEach(function(x) {
		kernel.puts(`FOLDER    ${x}`);
	});

	contents.file_info.forEach(function(x) {
		kernel.puts(`${String((x.size/1024).toFixed(2)).padStart(7, "0")}kb ${x.name}`);
	});

	kernel.puts("");
}
