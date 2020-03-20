export default async function(kernel, settings) {
	settings.argv.shift();
	settings.argv.forEach(function(x) {
		kernel.mkfile(x, settings.path);
	});
}