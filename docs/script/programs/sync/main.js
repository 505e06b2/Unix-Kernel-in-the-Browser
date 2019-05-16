export default async function(kernel, settings) {
	kernel.puts("Synced storage");
	kernel.export_fs();
}