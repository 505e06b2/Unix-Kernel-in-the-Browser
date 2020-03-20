export default function(_kernel) {
	this.getLine = async (shown = true) => {
		let input_buffer = "";

		const synchronize_keydown = new Promise((resolve, reject) => {
			window.onkeydown = (e) => {
				//console.log(e.key);
				let current_char = "";

				switch(e.key) {
					case "Space":
						current_char = " ";
						break;

					case "Enter":
						current_char = "\n";
						break;

					case "Backspace":
						if(input_buffer) _kernel.output.removeChar(1);
						input_buffer = input_buffer.slice(0,-1);
						break;

					default:
						if(e.key.length < 2) current_char = e.key;
						break;
				}

				if(current_char) {
					e.preventDefault();
					_kernel.output.printString(current_char);
					input_buffer += current_char;
				}

				if(current_char === "\n") {
					window.onkeydown = null;
					resolve(input_buffer);
				}

			}
		});

		return await synchronize_keydown;
	}
}
