//server.js connect to data to the server.

define(function(require,exports) {
	console.log('server.js');

	var data = require('./data');
	var host = window.location.protocol + '//' + window.location.host;

	var inSubmit = false;

	var ui = require('ui');

	var id = null;

	exports.addPage = function(){
		if(data.PageObj.pages.length == 0 || inSubmit){return false;}
		inSubmit = true;
		var files = [];
		var otherInfos = [];

		data.PageObj.pages.forEach(function(page){
			files.push({id:page.id,file:page.file});
			otherInfos.push({id:page.id,buttons:page.buttons,w:page.w,h:page.h});
		});

		var formdata = new FormData();
		files.forEach(function(_file){
			formdata.append('file_' + _file.id , _file.file);
		});

		formdata.append('other',JSON.stringify(otherInfos));

		//todo: use progress here
		var url = host + '/mockup/';
		if(id){
			url = url + id;
		}
		var xhr = new XMLHttpRequest();
		var upload = xhr.upload;

        upload.addEventListener("progress", function (ev) {
            if (ev.lengthComputable) {
				ui.showLoading(ev.loaded/ev.total);
            }
        }, false);

        upload.addEventListener("error", function (ev) {alert('error!sorry:(');}, false);

	    upload.addEventListener("load", function (ev) {
            ui.hideLoading();
        }, false);

	    xhr.onreadystatechange = function(){
	        if(xhr.readyState === 4){
	        	inSubmit = false;
	        	var res = xhr.responseText;
	        	var _obj = JSON.parse(res);
	        	if(_obj.hasOwnProperty('id') && _obj.id){
	        		id = _obj.id;
	        		ui.DomIsShow('#preview',true);
	        		ui.changeInner('#preview','mockup success!'+
	        			' You can get your mockup at : &nbsp;&nbsp;&nbsp;'+
	        			'<a target="_blank" href=' + host + '/m/' + id + '>' + host + '/m/' + id + '</a>' + 
	        			'&nbsp;&nbsp;&nbsp;' + 
	        			'or scan <a target="_blank" href="http://chart.apis.google.com/chart?cht=qr&chl='+host + '/m/' + id + '&chs=200x200">QRcode</a>');
	        	}
	        }
	  	};

	  	xhr.open('POST',url); //url 是表单的提交地址。
	    xhr.send(formdata);
	};


});