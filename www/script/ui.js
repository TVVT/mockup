define(function(require,exports) {
	var doc = document;
	var startPage;
	var Inners = {}; // 恢复dom的内容。

	//是否显示dom
	//如果 是 则移除 class 'hide'
	//如果 否 则添加 class 'hide'
	//如果不填 则 切换。
	exports.DomIsShow=function(query,s){
		var dom = doc.querySelector(query);
		if(!dom){return false;}
		var cl = dom.classList;
		if(s == undefined){
			cl.toggle('hide');
		}else if(!s){
			cl.add('hide');
		}else{
			cl.remove('hide');
		}
	};

	//改变 innerHTML 纪录第一次的值。
	exports.changeInner = function(query,con){
		var dom = doc.querySelector(query);
		if(!dom){return false;}
		Inners[query] = Inners[query] || dom.innerHTML;
		dom.innerHTML = con;
	};

	// 还原到第一次的值。
	exports.restoreInner = function(query){
		var dom = doc.querySelector(query);
		var _inner = Inners[query];
		if(!dom || ! _inner){return false;}
		dom.innerHTML = _inner;
	};


});