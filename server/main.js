var express = require('express');
var app = express();
var formidable = require("formidable");
var jade = require('jade');
var fs = require('fs');

app.use(express.static(__dirname+ '/../www'));

app.set('view options', {
  layout: false
});


app.listen(8002);

console.log('server start at ' + __dirname +',@port 8002');

app.post('/mockup', function(req,res){
	console.log('post mockup form');
	var form = new formidable.IncomingForm();
	form.uploadDir = __dirname + '/../www/tmp';
  	form.encoding = 'binary';

  	var _stamp = Date.now();

    var _path = __dirname + '/../www/m/' + _stamp
    
  	mkdir(_path);

    var Pages = [];

    form.on('field',function(field,value){
      if(field == 'other'){
        var obj = JSON.parse(value);
        obj.forEach(function(_page){
          Pages.push(_page);
        });
      }
    }).on('file',function(field,file){
      var type = file.type;
      var file_id = field.split('_')[1];
            var suffix;
            switch(type){
                case 'image/jpeg' :
                    suffix = '.jpg';
                    break
                case 'image/png' :
                    suffix = '.png';
                    break;
                default:
                    suffix = '.gif';
                    break;
            }
        fs.rename(file.path , _path + '/' + file_id  + suffix);
    	 console.log('i got a file,man!');
       Pages.forEach(function(_page){
          if(file_id == _page.id){
            _page.src = file_id + suffix; 
          }
       });
    }).on('end',function(){
      var content = fs.readFileSync(__dirname + '/iphone.jade').toString();
      var buff = jade.compile(content);
      var html = buff({Pages:Pages});
      fs.writeFileSync(_path + '/index.html', html);
    	res.end(JSON.stringify({'w':_stamp}));
    });

   form.parse(req, function(err, fields, files) {
	    if (err) {
	      console.log(err);
	   	}
  	});
});

function mkdir(path, root) {
    var dirs = path.split('/'), dir = dirs.shift(), root = (root||'')+dir+'/';
    try { fs.mkdirSync(root); }
    catch (e) {
        //dir wasn't made, something went wrong
        if(!fs.statSync(root).isDirectory()) throw new Error(e);
    }

    return !dirs.length||mkdir(dirs.join('/'), root);
}
