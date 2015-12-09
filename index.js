
var express = require('express');
var glob = require('glob');
var app = express();
var spawn = require('child_process').spawn;
var os = require("os"),
    cpus = os.cpus();

app.set('view engine', 'jade');
app.use('/bower', express.static(__dirname+'/bower_components'));
app.use('/app', express.static(__dirname+'/app'));

app.all('/service/:methode/:type', function (req, res, next) {
  if (
    ( (req.params.methode==='start') || (req.params.methode==='stop') ) &&
    ( (req.params.type==='erp-dispatcher') || (req.params.type==='ocrservice') || (req.params.type==='grab-service'))
  ){
    var ps = spawn('service',[req.params.type,req.params.methode]);
    var psdata = "";
    var success=true;
    var error=null;
    ps.stdout.on('data',function(data){
      psdata+=data.toString()+"\n";
    });
    ps.on('close', function (code, signal) {

      setTimeout(function(){
        res.json({success:success,data: psdata,error: error});
      },3000);

    });
    ps.on('error', function (err) {
      success = false;
      error=err;
    });
  }else{
    res.json({success:false,data: psdata,error: "not allowed"});
  }
});

app.all('/services', function (req, res, next) {
  var ps = spawn('ps', ['aux']);
  var psdata = "";
  ps.stdout.on('data',function(data){
    psdata+=data.toString()+"\n";
  });
  ps.on('close', function (code, signal) {
    var o = {
      camera: /\sgrab\s/.test(psdata),
      ocrservice: /ocrservice-bcocr/.test(psdata),
      erpdispatcher: /erp\-dispatcher/.test(psdata)
    }

    o.cpus=[];
    for(var i = 0, len = cpus.length; i < len; i++) {
      o.cpus[i] = {
      };

      var cpu = cpus[i], total = 0;
      for(type in cpu.times){
        total += cpu.times[type];
      }

      for(type in cpu.times){
        o.cpus[i][type] = Math.round(100 * cpu.times[type] / total);
      }
      //    console.log("\t", type, Math.round(100 * cpu.times[type] / total));
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
  res.render(__dirname+'/views/index', { title: 'OCR Machine' });
});

var port = process.env.SERVER_SERVICE_PORT||3000;
app.listen(port);
