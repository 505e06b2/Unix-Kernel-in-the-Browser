import kernel from "./kernel/main.js";

window.onload = async function() {
	kernel.printf(`
                /$$$$$$$   /$$$$$$  /$$$$$$$                     
               | $$____/  /$$$_  $$| $$____/                     
               | $$      | $$$$\\ $$| $$        /$$$$$$   /$$$$$$$
               | $$$$$$$ | $$ $$ $$| $$$$$$$  /$$__  $$ /$$_____/
               |_____  $$| $$\\ $$$$|_____  $$| $$  \\ $$|  $$$$$$ 
                /$$  \\ $$| $$ \\ $$$ /$$  \\ $$| $$  | $$ \\____  $$
               |  $$$$$$/|  $$$$$$/|  $$$$$$/|  $$$$$$/ /$$$$$$$/
                \\______/  \\______/  \\______/  \\______/ |_______/  

 =============================================================================== 
`);
	if(kernel.import_fs()) {
		kernel.puts("Filesystem loaded from localStorage");
		const info = kernel.fs_info();
		kernel.printf(`${info.files} file(s) | ${info.folders} folder(s) - ${(info.size/1024).toFixed(2)}kb\n`);
	}
	await kernel.exec("sh"); //async
	kernel.puts("[!] init.js has closed!");
	kernel.puts("[!] Kernel execution halted");
}
