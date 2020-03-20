export default async function(kernel, settings) {
	settings.argv.shift();
	settings.argv.forEach(function(x) {
		kernel.rm(x, settings.path);
	});
}