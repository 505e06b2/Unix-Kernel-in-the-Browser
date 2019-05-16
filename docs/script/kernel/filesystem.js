export default function() {
	const self = this;
	
	self.rootfs = {};
	
	self.parse = function(str, abspath, list = false) {
		if(str === "/") {
			return (list) ? [] : self.rootfs;
		}
		try {
			let nodeList = [];
			let nodeNameList = [];
			let currentNode = self.rootfs;
			
			if(!str.startsWith("/")) str = abspath + "/" + str;
			
			str.split("/").forEach(function(x) {
				if(x === "..") {
					nodeNameList.pop();
					currentNode = nodeList.pop();
					if(currentNode === undefined) currentNode = self.rootfs;
				} else if(x !== "" && x !== ".") {
					nodeNameList.push(x);
					nodeList.push(currentNode);
					currentNode = currentNode[x];
				}
			});
			
			return (list) ? nodeNameList : currentNode;
			
		} catch(e) {
			console.log(e);
			return null;
		}
	}
	
	self.realpath = function(str, abspath) {
		let pathnode = self.parse(str, abspath, true);
		let path = "/";
		
		pathnode.forEach(function(x) {
			path += x + "/";
		});
		
		return path;
	}
	
	self.import = function(str) {
		self.rootfs = JSON.parse(str);
	}
	
	self.export = function() {
		return JSON.stringify(self.rootfs);
	}
}