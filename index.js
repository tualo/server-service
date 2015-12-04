
var express = require('express');
var glob = require('glob');
var app = express();
var spawn = require('child_process').spawn;

app.set('view engine', 'jade');
app.use('/bower', express.static('bower_components'));
app.use('/app', express.static('app'));

app.all('/service/:methode/:type', function (req, res, next) {
  console.log('service',[req.params.type,req.params.methode]);
  var ps = spawn('service',[req.params.type,req.params.methode]);
  var psdata = "";
  var success=true;
  var error=null;
  ps.stdout.on('data',function(data){
    psdata+=data.toString()+"\n";
  });
  ps.on('close', function (code, signal) {
    res.json({success:success,data: psdata,error: error});
  });
  ps.on('error', function (err) {
    success = false;
    error=err;
    //res.json({success:false,data: error});
  });
});

app.all('/services', function (req, res, next) {
  var ps = spawn('ps', ['aux']);
  var psdata = "";
  ps.stdout.on('data',function(data){
    psdata+=data.toString()+"\n";
  });
  ps.on('close', function (code, signal) {
    var o = {
      camera: /grab/.test(psdata),
      ocrservice: /ocrservice/.test(psdata),
      erpdispatcher: /erp\-dispatcher/.test(psdata)
    }
    res.json({success:true,data: o});
  });
});


app.all('/shutdown', function (req, res, next) {
  var psdata = "";
  var ps = spawn('shutdown', ['-P','1','"Webapp forces shutdown!"']);
  ps.stdout.on('data',function(data){
    psdata+=data.toString()+"\n";
  });
  ps.on('close', function (code, signal) {
    res.json({success:true,data: psdata});
  });
});


app.all('/openfiles', function (req, res, next) {
  glob('*.tiff',{cwd: process.env.GRAB_PATH },function(er,files){
    if (er){
      res.json({success:false,error: er});
    }else{
      var list = [];
      for(var i=0; i<files.length;i++){
        list.push({
          id: files[i]
        });
      }
      res.json({success:true,total: files.length,data:list});
    }
  });
});
app.all('/', function (req, res, next) {
  res.render('index', { title: 'OCR Machine' });
});

var port = process.env.SERVER_SERVICE_PORT||3000;
app.listen(port);
