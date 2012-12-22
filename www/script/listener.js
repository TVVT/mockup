define(function(require,exports){
    touch = require('touch');
    var data = require('./data');
	var ui = require('./ui');
    var cvs = require('./cvs');
	var doc = document;
	var FU = doc.getElementById('dragArea');

    var objectURL;

    // var window.URL.revokeObjectURL(objectURL);
	exports.init = function(){
		exports._initFileEvent();
		exports._initBtnEvents();
        exports._initCanvasEvents();
	};

	exports.addBtnEvent = function(query,fun,type){
		var dom = doc.querySelector(query);
		type = type || 'click';
		if (!!dom) {
			dom.addEventListener(type,function(e){
				fun && fun.apply(this,[e]);
			},false);
		};
	};

	exports._initBtnEvents = function(){
		exports.addBtnEvent('#add',function(e){ui.DomIsShow('#newPage',true);});
		exports.addBtnEvent('#newPageFinish',function(e){
            ui.DomIsShow('#newPage',false);
            ui.restoreInner('#dragArea');
            if(FU.style.backgroundImage){
                data.addPage();
            }
            FU.style.backgroundImage = '';
        });
	};

	exports._initFileEvent = function(){
		if(!FU){return false;}

		var drawFile = function(file){
            objectURL && window.webkitURL.revokeObjectURL(objectURL); //将之前的从内存中清空掉。
            objectURL = window.webkitURL.createObjectURL(file);
            
            var _img = new Image();
            _img.src = objectURL;
            _img.onload = function(){
                var _w = _img.width;
                var _h = _img.height;
                if(_w !== 320){
                    alert('please cut your image to 320px;');
                    return false;
                }else{
                    FU.style.border = '';
                    ui.changeInner('#dragArea','');
                    FU.style.backgroundImage = 'url(' + objectURL +')';
                    var id = Date.now();
                    data.changeCurrent({'id':id,'file':file,'img':_img,'h':_h,'w':_w});
                }
            }
		};

		FU.addEventListener('dblclick',function(){
            var _input = doc.createElement('input');
            _input.setAttribute('type','file');
            _input.setAttribute('accept','image/*');
            _input.click();
            _input.addEventListener('change',function(e){
                var file = _input.files[0];
                drawFile(file);
            });
        });

        FU.addEventListener('dragenter', function(e) {
            e.preventDefault();
            this.style.border = '1px solid red';
        }, false); 
        FU.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.border = '';
        }, false);
        FU.addEventListener('dragover', function(e) {
            e.preventDefault();
        }, false);
        FU.addEventListener('drop', function(e) {
            e.preventDefault();
            var file = e.dataTransfer.files[0];
            var type = file.type;
            if(type.match('image')){
                drawFile(file);
            }else{
                alert('please drag a image!');
            }
        }, false);
	};


    exports._initCanvasEvents = function(){
        var canvas = document.getElementById('canvas');

        var canvasMove = function(e,dir,disX,disY,x,y){
            console.log(x);
        };

        touch({
            element : canvas,
            click : function(x,y){
                // exports._click(x,y);
            },
            start : function(e,x,y){
                cvs.start(e,x,y);
            },
            move : function(e,dir,disX,disY,x,y){
                cvs.move(e,dir,disX,disY,x,y);
            },
            dbclick : function(x,y){
                cvs.dbclick(x,y);
            },
            end : function(){
                cvs.end();
                // exports._end();
            },
            startZoom : function(){
                // exports.startZoom();
            },
            zoom : function(e,sp1,sp2,mp1,mp2){
                // exports.zoom(e,sp1,sp2,mp1,mp2);
            }
        });
    };

});