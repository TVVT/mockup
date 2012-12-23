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

	//通过id删除页面。
	exports.removePage = function(id){
		var index;
		for(var n = PageObj.pages.length-1;n>=0;n--){
			var el = PageObj.pages[n];
			if(el.id === id){
				index = n;
				break;
			}
		}
		if(index !== undefined){
			PageObj.pages.forEach(function(_page){
				if(_page.buttons){
					_page.buttons.forEach(function(_btn){
						if(_btn.link === id){
							_btn.link = null;
						}
					});
				}
			});
			PageObj.pages.splice(index,1);
			PageObj.stamp = Date.now();
		}
	};

	//通过id删除页面。
	exports.removeButton = function(page,button){
		var index;
		for(var n = page.buttons.length-1;n>=0;n--){
			var el = page.buttons[n];
			if(el === button){
				index = n;
				break;
			}
		}
		if(index !== undefined){
			page.buttons.splice(index,1);
			PageObj.stamp = Date.now();
		}
	};



	exports.changeCurrent = function(obj){
		for(var name in obj){
			current[name] = obj[name];
		}
	};

	exports.addPageButton = function(page,sx,sy,w,h){
		// var page = exports.getPageById(id);
		if(!page){return false;}
		page.buttons = page.buttons || [];
		var button = {};

		if( w > 0 ){
			button.w = Math.min(w,(page.x + page.w - sx));
			button.x = sx - page.x;
		}else{
			button.w = Math.abs(Math.max(w,(page.x-sx)));
			button.x = Math.max(sx - button.w - page.x,0);
		}

		if(h > 0){
			button.h = Math.min(h,(page.y + page.h - sy));
			button.y = sy - page.y;
		}else{
			button.h = Math.abs(Math.max(h,(page.y-sy)));
			button.y = Math.max(sy - button.h - page.y,0);
		}

		page.buttons.push(button);
		PageObj.stamp = Date.now();
	};

	exports.linkButton = function(button,page){
		button.link = page.id;
		PageObj.stamp = Date.now();
	};


	exports.getPageById = function(id){
		var page;
		for(var n = PageObj.pages.length-1;n>=0;n--){
			var el = PageObj.pages[n];
			if(el.id === id){
				page = el;
				break;
			}
		}
		return page;
	};

	exports.PageObj = PageObj;

});