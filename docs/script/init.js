import kernel from "./kernel/main.js";

window.onload = async function() {
	kernel.printf(`                                     505os*                                     
================================================================================\n`);
	await kernel.exec("sh"); //async
	kernel.printf("init has closed!\nExecution halted.\n");
}