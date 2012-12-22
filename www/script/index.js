//用来配置 sea.js.
seajs.config({
    base: './script',
    alias:{
        // 'three':'library/three.min.js',
        // 'touch':'library/touch.js',
        // 'jquery':'library/jquery-1.8.3.min.js'
    },
});

//sea.js 中的preload 只在 下一次use中生效.
seajs.use('index.js',function(index){
    index.init();
});

define(function(require,exports){
    var cvs = require('./cvs');
    var listener = require('./listener');


    exports.init = function(){
        listener.init();
        cvs.init();
    };


});

// var doc = document;
// var _add = doc.getElementById('add');
// var _newPage = doc.getElementById('newPage');
// var _dragArea = doc.getElementById('dragArea');
// var _newPageFinish = doc.getElementById('newPageFinish');
// var _main = doc.getElementById('main');
// var _canvas = doc.getElementById('canvas');
// var Pages = [];

// var pagePath = [];

// _add.addEventListener('click',function(){
//     _newPage.classList.add('show');
//     _newPage.classList.remove('hide');
// });

// _newPageFinish.addEventListener('click',function(){
//     _newPage.classList.remove('show');
//     _newPage.classList.add('hide');

//     var _bg = _dragArea.style['backgroundImage'];
//     if (!!_bg){
//         addPage();
//     };
// });



