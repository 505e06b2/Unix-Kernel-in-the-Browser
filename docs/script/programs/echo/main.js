export default async function(kernel, settings) {
	settings.argv.shift();
	kernel.puts(settings.argv.join(" "));
}