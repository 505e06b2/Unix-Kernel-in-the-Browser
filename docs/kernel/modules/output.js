export default function(_kernel, _output_container) {
	this.printString = async (str) => {
		_output_tag.innerHTML += str;
		_output_container.scrollTop = _output_tag.clientHeight;

		setCursor(_output_tag);
	}

	this.removeChar = async (amount) => {
		_output_tag.innerHTML = _output_tag.innerHTML.slice(0, -amount);
		_output_container.scrollTop = _output_tag.clientHeight;
		setCursor(_output_tag);
	}

	function setCursor(tag, pos = -1) {
		let range = document.createRange();
		let selection = window.getSelection();
		range.setStart(tag.childNodes[0], (pos < 0) ? tag.innerHTML.length + pos + 1 : pos );
		range.collapse(true);
		selection.removeAllRanges();
		selection.addRange(range);
		tag.focus();
	}

	//init

	_output_container.className = "terminal-container";
	_output_container.innerHTML = "";

	const _output_tag = document.createElement("pre");
	_output_tag.className = "terminal-interface";
	_output_tag.setAttribute("contenteditable", true);
	_output_tag.setAttribute("autocomplete", "off");
	_output_tag.setAttribute("autocorrect", "off");
	_output_tag.setAttribute("autocapitalize", "off");
	_output_tag.setAttribute("spellcheck", false);
	_output_tag.onkeydown = (e) => {e.preventDefault();}

	_output_container.onmousedown = (e) => {e.preventDefault(); setCursor(_output_tag);}
	_output_container.appendChild(_output_tag);
}
