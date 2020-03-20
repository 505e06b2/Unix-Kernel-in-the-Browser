export default function(output) {
	let previousbuffer = "";
	
	this.getLine = async function() {
		
		const promise = new Promise(function(resolve, reject) {
			let inputbuffer = "";
			
			window.onkeydown = function(e) {
				//console.log(e);
				switch(e.key) {
					case "ArrowUp":
						if(previousbuffer) {
							for(let i = 0; i < inputbuffer.length; i++) {
								output.deleteAtCursor();
							}
							inputbuffer = previousbuffer;
							output.printAtCursor(inputbuffer);
						}
						break;
						
					case "Enter":
						e.preventDefault();
						window.onkeydown = null;
						output.printAtCursor("\n");
						previousbuffer = inputbuffer;
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
						e.preventDefault();
						inputbuffer += " ";
						break;
					
					case "c":
						if(e.ctrlKey) {
							e.preventDefault();
							window.onkeydown = null;
							output.printAtCursor("\n");
							resolve(undefined);
							break;
						}
					
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
