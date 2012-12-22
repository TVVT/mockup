//data.js 存放页面的数据。不能调用其他模块
//当data的值发生变化时，需要改变时间戳。

define(function(require,exports){
	var PageObj = {};
	PageObj.pages = [];
	PageObj.stamp = Date.now();

	var current = {};
	var changeFlag; 

	//添加页面时 更改一下当前时间戳。
	exports.addPage = function(){
		var obj = {};
		for(var name in current){
			obj[name] = current[name];
		}
		PageObj.pages.push(obj);
		PageObj.stamp = Date.now();
	};

	exports.removePage = function(id){
		var index;
		for(var n = Pages.length-1;n>=0;n--){
			var el = Pages[n];
			if(el.id === id){
				index = n;
				break;
			}
		}
		if(index){
			PageObj.pages.splice(index,1);
			PageObj.stamp = Date.now();
		}
	};

	exports.changeCurrent = function(obj){
		for(var name in obj){
			current[name] = obj[name];
		}
	};

	exports.PageObj = PageObj;

});