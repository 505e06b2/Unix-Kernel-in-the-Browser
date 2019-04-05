export default function(id, overlay) {
	let self = this;
	//public
	self.elem = document.getElementById(id);
	self.getCurrentLine = function() {
		return lineElems[currentLine];
	}
	
	self.printAtCursor = function(txt) {
		for(let c of txt) {
			//check bounds
			if(lineElems[currentLine].innerText.length >= 80 || c == '\n') {
				if(currentLine < (displayLines - 1)) {
					currentLine += 1;
				} else {
					self.elem.innerHTML += "<div></div>";
					lineElems[0].outerHTML = "";
					setLineElems();
				}
				cursor_x = 0;
			}
			
			let charcode = c.charCodeAt(0);
			if(charcode >= 32 && charcode < 127) {
				lineElems[currentLine].innerText += c;
				cursor_x++;
			}
		}
		syncCursor();
	}
	
	self.deleteAtCursor = function() {
		if(lineElems[currentLine].innerText.length > 0) {
			let txt = lineElems[currentLine].innerText;
			lineElems[currentLine].innerText = txt.substring(0, txt.length-1);
			cursor_x--;
		} else {
			if(currentLine > 0) {
				currentLine--;
				let txt = lineElems[currentLine].innerText;
				lineElems[currentLine].innerText = txt.substring(0, txt.length-1);
				cursor_x = lineElems[currentLine].innerText.length;
			}
		}
		syncCursor();
	}
	
	self.clear = function() {
		self.elem.innerHTML = "";
		for(let i = 0; i < displayLines; i++) {
			self.elem.innerHTML += "<div></div>";
		}
		setLineElems();
		currentLine = 0;
		cursor_x = 0;
		syncCursor();
	}
	
	self.enterTextMode = function() {
		self.clear();
		if(cursorElem.interval) clearInterval(cursorElem.interval);
		cursorElem.interval = setInterval(function() {
			cursorElem.style.visibility = (cursorElem.style.visibility == "hidden") ? "visible" : "hidden";
		}, 1000);
	}
	
	//private
	let lineElems = null;
	let currentLine = 0; //this is the y of the cursor
	let cursor_x = 0;
	let cursorElem = document.createElement("span");
	let displayLines = self.elem.clientHeight / (function() {
		let line = getComputedStyle(document.querySelector("#main > div"));
		return parseInt(line.height) + parseInt(line.paddingTop) + parseInt(line.paddingBottom);
	})();
	
	let setLineElems = function() {lineElems = self.elem.getElementsByTagName("div");}
	
	let syncCursor = function() {
		let temp_y = currentLine;
		let temp_x;
		
		if(cursor_x == 80) { //edge case where a line is full
			temp_y++;
			temp_x = 0;
		} else {
			temp_x = cursor_x;
		}
		
		cursorElem.style.top = (temp_y * 20) + 10;
		cursorElem.style.left = (temp_x * 8) + 10;
	}
	
	//init
	cursorElem.className = "cursor";
	cursorElem.style.visibility = "hidden";
	cursorElem.innerHTML = "&nbsp;";
	document.getElementById(overlay).appendChild(cursorElem);
}
