//cvs.js canvas apis


define(function(require,exports) {
	var data = require('./data');
	var scale = 1.0;

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
		exports.render();
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
		var hoverPages = [];

		ctx.save();
		ctx.scale(scale,scale);


		data.PageObj.pages.forEach(function(el,index){
			if(el.x === undefined){el.x = 10;}
			if(el.y === undefined){el.y = 30;}
			if(!el.hover){
				exports._drawPage(el);
			}else{
				hoverPages.push(el);
			}
		});
		if(hoverPages){
			hoverPages.forEach(function(_page){
				exports._drawPage(_page);
			});
		}
		if(data.PageObj.pages.length > 0){
			exports._drawArrow(0,0,data.PageObj.pages[0].x+data.PageObj.pages[0].w/2,data.PageObj.pages[0].y);
		}

		ctx.restore();

	};

	//draw a page.
	exports._drawPage = function(page){
		var titleHeight = 20;
		ctx.save()
		ctx.drawImage(page.img,page.x,page.y + titleHeight);

		ctx.save();
		ctx.fillStyle = '#f3f3f3';
		ctx.shadowBlur = 5;
		ctx.shadowColor = 'rgba(0,0,0,0.3)';
		ctx.fillRect(page.x,page.y,page.w,titleHeight);
		ctx.fillRect(page.x,page.y+titleHeight+page.h,page.w,titleHeight);
		ctx.restore();

		if(page.hover){
			ctx.strokeStyle = 'red';
		}
		ctx.lineWidth = 1;
		ctx.strokeRect(page.x,page.y,page.w,page.h+titleHeight+titleHeight);
		ctx.restore();

		ctx.save();
		ctx.fillText(page.file.name,page.x+10,page.y+15,page.w-10);
		ctx.fillText('w:' + page.w + 'px , h:' + page.h +'px',page.x+10,page.y+page.h+titleHeight+15,page.w-10);
		ctx.restore();

		if(page.buttons){
			page.buttons.forEach(function(btn){
				exports._drawButton(page.x+btn.x,page.y+btn.y+titleHeight,btn.w,btn.h);
				if(btn.link){
					var _page = data.getPageById(btn.link);
					if(_page){
						exports._drawArrow(page.x+btn.x + btn.w/2,page.y+btn.y+titleHeight + btn.h/2,_page.x,_page.y + _page.h/2+titleHeight);
					}
				}
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

		ctx.beginPath();
		ctx.arc(ex,ey,4,0,360);
		ctx.stroke();
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
	var GotButton;
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
			GotButton = exports.gotButton(GotPage,x,y);
			if(y - GotPageStartY < 20 ){
				moveMode = 'drag';
				canvas.style['cursor'] = 'move';
				GotPage.hover = true;
			}else if(!!GotButton){
				moveMode = 'linkButton';
			}else{
				moveMode = 'addButton';
			}
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
			}else if(moveMode == 'linkButton'){
				lastedMoveX = x;
				lastedMoveY = y;
				var _page = exports.gotPage(x,y);
				if(_page && _page.id !== GotPage.id){
					_page.hover = true;
				}
				exports.render();
				exports._drawArrow(startX,startY,x,y);
			}
		}
	};

	exports.dbclick = function(x,y){
		var page = exports.gotPage(x,y);
		if(!!page){
			var btn = exports.gotButton(page,x,y);
			if(!!btn){
				data.removeButton(page,btn);
			}else{
				var id = page.id;
				data.removePage(id);
			}
		}
	};

	//end
	exports.end = function(){
		if(!!GotPage && startX && startY){
			if(moveMode == 'addButton' && lastedMoveX && lastedMoveY){
				data.addPageButton(GotPage,startX,startY-20,lastedMoveX-startX,lastedMoveY-startY);
			}else if(moveMode == 'linkButton' && lastedMoveX && lastedMoveY){
				var _page = exports.gotPage(lastedMoveX,lastedMoveY);
				if(!!_page){
					data.linkButton(GotButton,_page);
				}
			}
			GotPage = null;
			GotButton = null;
			startX = null;
			startY = null;
			GotPageStartX = null;
			GotPageStartY = null;
			lastedMoveX = null;
			lastedMoveY = null;

			data.PageObj.pages.forEach(function(el){
				el.hover = false;
			});

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

	exports.gotButton = function(page,x,y){
		if(!page.buttons){return false;}
		var button;
		for(var i = page.buttons.length - 1; i>=0;i--){
			var el = page.buttons[i];
			if(x > page.x + el.x && x < page.x + el.x + el.w && y > page.y + el.y && y < page.y + el.y + el.h+20){
				button = el;
				break;
			}
		}
		return button;
	};

	exports.zoomIn = function(){
		exports._zoom(1.1);
	};

	exports.zoomOut = function(){
		exports._zoom(0.9);
	};

	exports._zoom = function(s){
		scale = scale * s;
		exports.render();
	};


});

