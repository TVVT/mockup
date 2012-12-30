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

app.post('/mockup/:id?', function(req,res){

	console.log('post mockup form');
	var form = new formidable.IncomingForm();
	form.uploadDir = __dirname + '/../www/tmp';
  	form.encoding = 'binary';

  	var _stamp ;

    var id = req.params.id;
    if(!id){
      _stamp = Date.now();
    }else{
      _stamp = id;
    }

    var _path = __dirname + '/../www/m/' + _stamp;
    mkdir(_path);

    var Pages = [];
    var Srcs = [];

    form.on('field',function(field,value){
      console.log('fields');
      if(field == 'other'){
        var obj = JSON.parse(value);
        obj.forEach(function(_page){
          Pages.push(_page);
        });
      }else if(field == 'id'){
        _stamp = value;
      }
    }).on('file',function(field,file){
      var type = file.type;
      console.log(field);
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
       Srcs.push({id:file_id,suffix:suffix,name:file.name});
    }).on('end',function(){

      Pages.forEach(function(_page){
          Srcs.forEach(function(_src){
            if(_src.id == _page.id){
              _page.src = _src.id + _src.suffix;
              _page.name = _src.name;
            }
          });
      });

      var content = fs.readFileSync(__dirname + '/iphone.jade').toString();
      var buff = jade.compile(content);
      var html = buff({Pages:Pages,title:Srcs[0].name + '- eizia mockup'});
      fs.writeFileSync(_path + '/index.html', html);
    	res.end(JSON.stringify({'id':_stamp}));
    });
    
   form.encoding = 'utf-8';
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
