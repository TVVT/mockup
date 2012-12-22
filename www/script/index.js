//用来配置 sea.js.
seajs.config({
    base: './script',
    alias:{
        'touch':'library/touch.js'
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

