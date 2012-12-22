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
		data.PageObj.pages.forEach(function(el,index){
			if(el.x === undefined){el.x = 10;}
			if(el.y === undefined){el.y = 30;}
			if(!el.selected){
				exports._drawPage(el);
			}else{
				selectedPage = el;
			}
		});
		if(selectedPage){
			exports._drawPage(selectedPage);
		}
		if(data.PageObj.pages.length > 0){
			exports._drawArrow(0,0,data.PageObj.pages[0].x+data.PageObj.pages[0].w/2,data.PageObj.pages[0].y);
		}

	};

	//draw a page.
	exports._drawPage = function(page){
		var titleHeight = 20;
		ctx.save()
		ctx.fillStyle = '#f3f3f3';
		ctx.drawImage(page.img,page.x,page.y + titleHeight);

		ctx.save();
		ctx.shadowBlur = 5;
		ctx.shadowColor = 'rgba(0,0,0,0.3)';
		ctx.fillRect(page.x,page.y,page.w,titleHeight);
		ctx.restore();

		if(page.selected){
			ctx.strokeStyle = 'red';
		}
		ctx.lineWidth = 1;
		ctx.strokeRect(page.x,page.y,page.w,page.h+titleHeight);
		ctx.restore();

		if(page.buttons){
			page.buttons.forEach(function(btn){
				exports._drawButton(page.x+btn.x,page.y+btn.y+titleHeight,btn.w,btn.h);
			});
		}
	};


	//draw arrows
	exports._drawArrow = function(sx,sy,ex,ey){
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = "#333";
		ctx.moveTo(sx,sy);
		ctx.lineTo(ex,ey);
		ctx.stroke();
		ctx.fillStyle = "red";
		ctx.closePath();
		ctx.arc(ex,ey,5,0,360);
		ctx.fill();
		ctx.restore();
	};

	//绘制按钮。
	exports._drawButton = function(sx,sy,w,h){
		ctx.save();
		ctx.fillStyle = 'rgba(250,10,2,0.3)';
		ctx.fillRect(sx,sy,w,h);
		ctx.strokeRect(sx,sy,w,h);
		ctx.restore();
	};

	//鼠标开始事件。
	var GotPage;
	var GotPageStartX,GotPageStartY;
	var startX,starY;
	var moveAction;
	var moveMode;
	exports.start = function(e,x,y){
		GotPage = exports.gotPage(x,y);
		if(!!GotPage){
			GotPageStartX = GotPage.x;
			GotPageStartY = GotPage.y;
			startX = x;
			startY = y;
			if(y - GotPageStartY < 20 ){
				moveMode = 'drag';
				canvas.style['cursor'] = 'move';
			}else{
				moveMode = 'addButton';
			}
			GotPage.selected = true;
			data.PageObj.stamp = Date.now();
		}
	};

	//鼠标移动事件。
	var lastedMoveX,lastedMoveY;
	exports.move = function(e,dir,disX,disY,x,y){
		if(!!GotPage && startX && startY){
			if(moveMode == 'drag'){
				var newX = GotPageStartX + (x-startX) > 0 ? GotPageStartX + (x-startX) : 0;
				var newY = GotPageStartY + (y-startY) > 0 ? GotPageStartY + (y-startY) : 0;
				GotPage.x = newX;
				GotPage.y = newY;
				data.PageObj.stamp = Date.now();	
			}else if(moveMode == 'addButton'){
				lastedMoveX = x;
				lastedMoveY = y;
				exports.render();
				exports._drawButton(startX,startY,x-startX,y-startY);
			}
		}
	};

	exports.dbclick = function(x,y){
		var page = exports.gotPage(x,y);
		if(!!page){
			var id = page.id;
			data.removePage(id);
		}
	};

	//end
	exports.end = function(){
		if(!!GotPage && startX && startY){
			if(moveMode == 'addButton' && lastedMoveX && lastedMoveY){
				data.addPageButton(GotPage.id,startX,startY-20,lastedMoveX-startX,lastedMoveY-startY);
			}
			GotPage.selected = false;
			GotPage = null;
			startX = null;
			startY = null;
			GotPageStartX = null;
			GotPageStartY = null;
			lastedMoveX = null;
			lastedMoveY = null;

			data.PageObj.stamp = Date.now();
			moveMode = null;
		}
		canvas.style['cursor'] = '';
	};

	//监测是否获取到了页面。
	exports.gotPage = function(x,y){
		var page;
		for(var i=data.PageObj.pages.length - 1; i >=0; i--){
			var el = data.PageObj.pages[i];
			if(x > el.x && x < el.x + el.w && y > el.y && y < el.y + el.h+20){
				page = el;
				break;
			}
		}
		return page;
	};




});

