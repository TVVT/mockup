define(function(require,exports) {
	var data = require('./data');

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var parent = document.getElementById('main');

	var PageStamp;

	var nextFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) { return setTimeout(callback, 100); };
    })();

 	var cancelFrame = (function () {
        return window.cancelRequestAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout;
    })();

	exports.init = function(){
		exports.resize();
		exports.listenPages();
	};

	exports.resize = function(){
		var _w = parent.clientWidth;
		var _h = parent.clientHeight;
		canvas.width = _w;
		canvas.height = _h;
	};	

	exports.addPage = function(page){
		ctx.drawImage(page.img,0,0);
	};

	exports.listenPages = function(){
		var step = function(){
			var _pageStamp = data.PageObj.stamp;
			PageStamp = PageStamp || _pageStamp;

			if(PageStamp && PageStamp !== _pageStamp){
				PageStamp = _pageStamp;
				exports.render();
			}
			nextFrame(step);
		};
		nextFrame(step);
	};

	exports.render = function(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		var selectedPage;
		data.PageObj.pages.forEach(function(el){
			if(el.x === undefined){el.x = 0;}
			if(el.y === undefined){el.y = 0;}
			if(!el.selected){
				exports._drawPage(el);
			}else{
				selectedPage = el;
			}
		});
		if(selectedPage){
			exports._drawPage(selectedPage);
		}
	};

	//draw a page.
	exports._drawPage = function(page){
		var titleHeight = 20;
		ctx.save()
		ctx.fillStyle = '#f3f3f3';
		ctx.fillRect(page.x,page.y,page.w,titleHeight);
		ctx.drawImage(page.img,page.x,page.y + titleHeight);
		ctx.strokeRect(page.x,page.y,page.w,page.h+titleHeight);
		ctx.restore();
	};

	//鼠标开始事件。
	var GotPage;
	var GotPageStartX,GotPageStartY;
	var startX,starY;
	var moveAction;
	exports.start = function(e,x,y){
		GotPage = exports.gotPage(x,y);
		if(!!GotPage){
			GotPageStartX = GotPage.x;
			GotPageStartY = GotPage.y;
			startX = x;
			startY = y;
			GotPage.selected = true;
			data.PageObj.stamp = Date.now();
		}
	};

	//鼠标移动事件。
	exports.move = function(e,dir,disX,disY,x,y){
		if(!!GotPage && startX && startY){
			var newX = GotPageStartX + (x-startX) > 0 ? GotPageStartX + (x-startX) : 0;
			var newY = GotPageStartY + (y-startY) > 0 ? GotPageStartY + (y-startY) : 0;
			GotPage.x = newX;
			GotPage.y = newY;
			data.PageObj.stamp = Date.now();
		}
	};

	//end
	exports.end = function(){
		if(!!GotPage && startX && startY){
			GotPage.selected = false;
			GotPage = null;
			startX = null;
			startY = null;
			GotPageStartX = null;
			GotPageStartY = null;
			data.PageObj.stamp = Date.now();
		}
	};

	//监测是否获取到了页面。
	exports.gotPage = function(x,y){
		var page;
		for(var i=data.PageObj.pages.length - 1; i >=0; i--){
			var el = data.PageObj.pages[i];
			if(x > el.x && x < el.x + el.w && y > el.y && y < el.y + el.h){
				page = el;
				break;
			}
		}
		return page;
	};






});

