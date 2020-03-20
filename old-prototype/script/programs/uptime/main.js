export default async function(kernel, settings) {
	kernel.puts(kernel.getuptime()/1000 + "s");
}