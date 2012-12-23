//server.js connect to data to the server.

define(function(require,exports) {
	console.log('server.js');

	var data = require('./data');
	var host = window.location.origin;
	var inSubmit = false;

	exports.addPage = function(){
		if(data.PageObj.pages.length == 0 || inSubmit){return false;}
		inSubmit = true;
		var files = [];
		var otherInfos = [];

		data.PageObj.pages.forEach(function(page){
			files.push({id:page.id,file:page.file});
			otherInfos.push({id:page.id,buttons:page.buttons});
		});

		var formdata = new FormData();

		files.forEach(function(_file){
			formdata.append('file_' + _file.id , _file.file);
		});

		formdata.append('other',JSON.stringify(otherInfos));
		//todo: use progress here
		var url = host + '/mockup';
		var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function(){
	        if(xhr.readyState === 4){
	        	inSubmit = false;
	        	console.log(xhr.response);
	        }
	  	};
	  	xhr.open('POST',url); //url 是表单的提交地址。
	    xhr.send(formdata);
	};


});