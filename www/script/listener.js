define(function(require,exports){
    touch = require('touch');
    var data = require('./data');
	var ui = require('./ui');
    var cvs = require('./cvs');
    var server = require('./server');

	var doc = document;
	var FU = doc.getElementById('canvas');
    var Add = doc.getElementById('add');

    var objectURL;

    var VENDOR = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
                (/firefox/i).test(navigator.userAgent) ? 'Moz' :
                    (/trident/i).test(navigator.userAgent) ? 'ms' :
                        'opera' in window ? 'o' : '';

    var WHEEL_EV = VENDOR == 'Moz' ? 'DOMMouseScroll' : 'mousewheel';

    // var window.URL.revokeObjectURL(objectURL);
	exports.init = function(){
		exports._initFileEvent();
		exports._initBtnEvents();
        exports._initCanvasEvents();
        exports._initOtherEvents();
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
		exports.addBtnEvent('#newPageFinish',function(e){
            ui.DomIsShow('#newPage',false);
            ui.restoreInner('#dragArea');
            if(FU.style.backgroundImage){
                data.addPage();
            }
            FU.style.backgroundImage = '';
        });

        exports.addBtnEvent('#submit',function(){
            server.addPage();
        });
	};

	exports._initFileEvent = function(){
		if(!FU){return false;}
		var drawFile = function(files){
            var objUrls = [];

            for(var n=0;n<files.length;n++){
                var file = files[n];
                objUrls.push(window.webkitURL.createObjectURL(file));
            }

            var addPage = function(n){
                if(n >= objUrls.length){return false;}
                var _img = new Image();
                _img.src = objUrls[n];
                _img.onload = function(){
                    var _w = _img.width;
                    var _h = _img.height;
                    var id = Date.now();
                    data.changeCurrent({'id':id,'file':files[n],'img':_img,'h':_h,'w':_w});
                    data.addPage();
                    window.webkitURL.revokeObjectURL(objUrls[n]);
                    addPage(n+1);
                }
            }
            addPage(0);
		};

        Add.addEventListener('click',function(){
            var _input = doc.createElement('input');
            _input.setAttribute('type','file');
            _input.setAttribute('multiple','multiple');
            _input.setAttribute('accept','image/*');
            _input.click();

            _input.addEventListener('change',function(){
                var files = _input.files;
                drawFile(files);
            });
        });

        FU.addEventListener('dragenter', function(e) {
            e.preventDefault();
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
            var files = e.dataTransfer.files;
            drawFile(files);
        }, false);
	};


    exports._initCanvasEvents = function(){
        var canvas = document.getElementById('canvas');

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

        canvas.addEventListener(WHEEL_EV,function(e){
            e.preventDefault();
            // for firefox wheel。
            var _delta = e.wheelDelta ? e.wheelDelta : -(e.detail);
            if(_delta > 0 ){//down
                cvs.zoomIn();
            }else if(_delta < 0){//up
                cvs.zoomOut();
            }
        },false);



    };



    exports._initOtherEvents = function(){
        window.addEventListener('resize',function(){
            cvs.resize();
        },false);
    };

});