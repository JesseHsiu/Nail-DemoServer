//==== Import Modules ====
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var shell = require('shelljs');
var fs = require('fs');
var csv = require("fast-csv");
module.exports = app;


//==== Express Settings ====
app.use( bodyParser.json() ); 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Web Interface. "ajax"
app.get('/', function(req, res){
   // res.render('index.html');
   res.sendFile(__dirname + '/index.html');
});

app.listen(3000);
//==== Global Variables ====
app.locals.SGs = {
  calibrationBase : [1,1,1,1,1,1,1,1,1],
  currentValue : [1,1,1,1,1,1,1,1,1]
} 

//self made modules
var trainningPart = require('./trainningPart.js');
var predictPart = require('./predictPart.js');

//controls Things
var smartPhoneControl = require('./smartPhoneControl.js');
var smartTVControl = require('./smartTVControl.js');
var smartWatchControl = require('./smartWatchControl.js');

var thingsToBeControlled = [smartTVControl,smartPhoneControl,smartWatchControl];

//==== State Machine ====
var stateMachine = {
  IDLE: 0,
  RECORDING: 1,
  DEMOING: 2,
};

var controlThing = {
  NONE: -1,
  SMARTTV: 0,
  PHONE: 1,
  WATCH: 2,
};

var gestures = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
  TAP: 4,
};
var appStateMachine = stateMachine.IDLE;
var appControlThing = controlThing.NONE;

// === GET SG VALUES PART ===

var handlerForNewData = function(datas) {

  //TODO - DEBUG ONLY
  var storeDataToArray = datas.split(" ")
  for (var i = 1; i <= 9; i++) {
    app.locals.SGs.currentValue[i-1] = parseInt(storeDataToArray[i]);
  };
  
  //! update calibration first
  //! endofTheInput

  var endOfInput = false;

  if (appStateMachine == stateMachine.IDLE)
  {
    return;
  }
  else if (appStateMachine == stateMachine.RECORDING)
  {
    console.log(datas);
    trainningPart.recordData(datas);  
  }
  else if (appStateMachine == stateMachine.DEMOING)
  {
    predictPart.recordData(datas);
  }
  
};

//received from linkit one.
app.post('/', function(req, res) {
  // console.log(req.rawHeaders);
  // handlerForNewData(req.rawHeaders);
  
  handlerForNewData(req.body.datas)
  // console.log(req.body.name)
  // console.log(req.body.time)

  res.sendStatus(200);
});



//received from webpages.



app.get('/SGValues', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_SGValues(\'{"values": "'+ app.locals.SGs.currentValue + '"}\')');
});

//Tranning Functions

app.get('/trainning/sync', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_testcb(\'{"currentGesture": "'+ trainningPart.currentGesture +'", "finished" : "'+ trainningPart.finished +'"}\')');
});

app.get('/trainning/start', function(req, res){
  console.log("start");
  appStateMachine = stateMachine.RECORDING;
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_testcb(\'{"currentGesture": "'+ trainningPart.currentGesture +'", "finished" : "'+ trainningPart.finished +'"}\')');
});

app.get('/trainning/end', function(req, res){
  console.log("end:" + trainningPart.currentGesture + " / " + trainningPart.currentTime);
  trainningPart.endOfrecording(function (argument) {
    appStateMachine = stateMachine.IDLE;
    // trainningPart.nextTask();
    
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('_testcb(\'{"currentGesture": "'+ trainningPart.currentGesture +'", "finished" : "'+ trainningPart.finished +'"}\')');
  });
});

app.get('/trainning/buildmodel', function(req, res){
  trainningPart.generateModel();
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_testcb(\'{"message": "ok"}\')');
});

app.get('/trainning/reset', function(req, res){
  trainningPart.clearDatas();
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_testcb(\'{"message": "ok"}\')');
});

//Predict Functions
app.get('/predict/start', function(req, res){
  console.log("start");
  appStateMachine = stateMachine.DEMOING;
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_testcb(\'{"message": "ok"}\')');
});

app.get('/predict/end', function(req, res){
  console.log("end");
  appStateMachine = stateMachine.IDLE;

  predictPart.endOfrecording(function (arguments) {
    predictPart.predictOnModel(function (predictResult) {
      console.log("results:" + predictResult);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('_testcb(\'{"message": "'+ predictResult +'"}\')');

      if (appControlThing != controlThing.NONE)
      {
        switch (int(predictResult))
        {
          case gestures.UP:
            thingsToBeControlled[appControlThing].swipeUp();
            break;
          case gestures.RIGHT:
            thingsToBeControlled[appControlThing].swipeRight();
            break;
          case gestures.DOWN:
            thingsToBeControlled[appControlThing].swipeDown();
            break;
          case gestures.LEFT:
            thingsToBeControlled[appControlThing].swipeLeft();
            break;
          case gestures.TAP:
            thingsToBeControlled[appControlThing].tap();
            break;
          default:
            break;
        }
      };
      // predictPart.clearDatas();

      
    });
  });
  
});

app.get('/predict/reset', function(req, res){
  predictPart.clearDatas();
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_testcb(\'{"message": "ok"}\')');
});

app.get('/demoDevice/:device',function (req, res) {
  console.log(req.params.device);
  switch (parseInt(req.params.device))
  {
    case controlThing.NONE:
      appControlThing = controlThing.NONE;
      break;
    case controlThing.SMARTTV:
      appControlThing = controlThing.SMARTTV;
      break;
    case controlThing.PHONE:
      appControlThing = controlThing.PHONE;
      break;
    case controlThing.WATCH:
      appControlThing = controlThing.WATCH;
      break;
  }
  
});

app.get('/demo/:gesture',function (req, res) {
  console.log("gesture: " + req.params.gesture);

  if (appControlThing != controlThing.NONE)
  {
    switch (parseInt(req.params.gesture))
    {
      case gestures.UP:
        thingsToBeControlled[appControlThing].swipeUp();
        break;
      case gestures.RIGHT:
        thingsToBeControlled[appControlThing].swipeRight();
        break;
      case gestures.DOWN:
        thingsToBeControlled[appControlThing].swipeDown();
        break;
      case gestures.LEFT:
        thingsToBeControlled[appControlThing].swipeLeft();
        break;
      case gestures.TAP:
        thingsToBeControlled[appControlThing].tap();
        break;
      default:
        break;
    }
  };


  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_testcb(\'{"message": "ok"}\')');
});
