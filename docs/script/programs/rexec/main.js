export default async function(kernel, settings) {
	settings.argv.shift(); //remove rexec
	let name = settings.argv.shift(); //url
	await kernel.remote_exec(name, {argv: settings.argv});
}
