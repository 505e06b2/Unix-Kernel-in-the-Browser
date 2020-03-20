export default async function(kernel, settings) {
	settings.argv.shift();
	settings.argv.forEach(function(x) {
		kernel.mkdir(x, settings.path);
	});
}