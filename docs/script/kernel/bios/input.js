export default function(output) {
	this.getLine = async function() {
		
		const promise = new Promise(function(resolve, reject) {
			let inputbuffer = "";
		
			window.onkeydown = function(e) {
				switch(e.key) {
					case "Enter":
						e.preventDefault();
						window.onkeydown = null;
						output.printAtCursor("\n");
						resolve(inputbuffer);
						break;

					case "Backspace":
						e.preventDefault();
						if(inputbuffer.length > 0) {
							inputbuffer = inputbuffer.substring(0, inputbuffer.length-1);
							output.deleteAtCursor();
						}
						break;

					case "Space":
					case "Tab":
						e.preventDefault();
						inputbuffer += " ";
						break;
					
					default:
						if(e.key.length == 1) {
							e.preventDefault();
							inputbuffer += e.key;
							output.printAtCursor(e.key);
						}
						break;
				}
			}
		
		});
		
		return await promise;
	}
}
