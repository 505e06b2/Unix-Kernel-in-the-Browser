import kernel from "./kernel/main.js";

window.onload = async function() {
	kernel.printf(`                                     505os*
================================================================================\n`);
	await kernel.exec("sh"); //async
	kernel.puts("[!] init.js has closed!");
	kernel.puts("[!] Kernel execution halted");
}
