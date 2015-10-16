//==== Import Modules ====
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var shell = require('shelljs');
var fs = require('fs');
var csv = require("fast-csv");

var socketio = require('http').createServer()
var io = require('socket.io')(socketio);
var clientSocket = undefined;

socketio.listen(8080);

//udp
var dgram = require("dgram");
var server = dgram.createSocket("udp4");

server.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  server.close();
});

// var testCount = 0;
var timeoutFunction;
server.on("message", function (msg, rinfo) {
  clearTimeout(timeoutFunction);
  // console.log(app.locals.SGs.currentValue);
  // console.log(req.rawHeaders);
  // console.log(String(msg));
  var receivedString = String(msg);
  if (receivedString.indexOf("startGesture") > -1)
  {
    console.log("startGesture");
    appStateMachine = stateMachine.DEMOING;
    clientSocket.emit('gesture', {currentGesture: gestures.NONE, color: "red"});
    setTimeout(function () {
      appStateMachine = stateMachine.IDLE;

      predictPart.endOfrecording(function (arguments) {
        predictPart.predictOnModel(function (predictResult) {
          console.log("results:" + predictResult);
          // TODO :
          // res.writeHead(200, {'Content-Type': 'text/plain'});
          // res.end('_testcb(\'{"message": "'+ predictResult +'"}\')');
          clientSocket.emit('gesture', {currentGesture: predictResult, color: "green"});
          if (appControlThing != controlThing.NONE)
          {
            switch (parseInt(predictResult))
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
          predictPart.clearDatas();
          timeoutFunction = setTimeout(function () {
            clientSocket.emit('gesture', {currentGesture: gestures.NONE, color: "green"});
          },5000);
          
        });
      });
    }, 3000);
  };
  // testCount++;
  handlerForNewData(String(msg));
  // if (clientSocket != undefined || clientSocket != null)
  // {
  //   clientSocket.emit('newSGValues', { values : app.locals.SGs.currentValue });  
  // };
  
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

server.bind(8081);

// var dgram = require('dgram');
// var net = require('net');
// var server = net.createServer();


// server.on('listening', function () {
//   console.log("listening");
// });

// server.on('connection', function (socket) {
//     //socket.pipe(socket);
//     // Client_socket = socket;
//     socket.on('data', function (data) {
//         // if(data == "connection")
//         // {
//             console.log("connect");
//             // ws.send('Linkit:connect');
//         // }
//         // if(data == "test")
//         // {
//             //console.log("dosomething");
//             // console.log("Send:done");
//             // ws.send('send');
//             //socket.write("done");
//         // }
//     });
// });


// server.listen(8080);


// var s = dgram.createSocket('udp4');

// s.on('listening', function() {
//   console.log("listening on " + s.address().address);
// });

// s.on('message', function(message, remote) {
//   // console.log(message)
//   console.log("111");
// });

// s.bind(8080, "192.168.1.18");








module.exports = app;


//==== Express Settings ====
// app.use( bodyParser.json() ); 
app.use(express.static('public'));
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// }));

// Web Interface. "ajax"
app.get('/', function(req, res){
   // res.render('index.html');
   res.sendFile(__dirname + '/index.html');
});

app.listen(3000);
//==== Global Variables ====
app.locals.SGs = {
  calibrationBase : [500,500,500,500,500,500,500,500,500],//500,500,500,500,500,500,500,500,500
  currentValue : [500,500,500,500,500,500,500,500,500]
} 

app.locals.demoMode = false;

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
  NONE: 5
};
var appStateMachine = stateMachine.IDLE;
var appControlThing = controlThing.NONE;

// === GET SG VALUES PART ===

var handlerForNewData = function(datas) {
  // console.log(datas);
  //TODO - DEBUG ONLY
  var storeDataToArray = datas.split(" ");
  // console.log(storeDataToArray);
  if (storeDataToArray.length == 11)
  {
    for (var i = 1; i <= 9; i++) {
      app.locals.SGs.currentValue[i-1] = parseInt(storeDataToArray[i]);
    };
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
  
  //! update calibration first
  //! endofTheInput

  
  
};

//received from linkit one.
app.post('/', function(req, res) {
  // '{"currentGesture": "'+ trainningPart.currentGesture +'","demoMode" : "'+ app.locals.demoMode +'" , "finished" : "'+ trainningPart.finished +'", "calibrationBase" : "'+ app.locals.SGs.calibrationBase +'"}'
  console.log(app.locals.SGs.currentValue);
  // console.log(req.rawHeaders);
  handlerForNewData(req.headers.host);
  clientSocket.emit('newSGValues', { values : app.locals.SGs.currentValue });
  // clientSocket.emit('gesture', {currentGesture: gestures.NONE, color: "red"});
  // console.log(req.headers.host);
  // handlerForNewData()
  // console.log(req.body.name)
  // console.log(req.body.time)

  // res.sendStatus(200);
});

app.post('/startGesture', function(req, res) {
  appStateMachine = stateMachine.DEMOING;
  clientSocket.emit('gesture', {currentGesture: gestures.NONE, color: "red"});
  setTimeout(function () {
    appStateMachine = stateMachine.IDLE;

    predictPart.endOfrecording(function (arguments) {
      predictPart.predictOnModel(function (predictResult) {
        console.log("results:" + predictResult);
        // TODO :
        // res.writeHead(200, {'Content-Type': 'text/plain'});
        // res.end('_testcb(\'{"message": "'+ predictResult +'"}\')');
        clientSocket.emit('gesture', {currentGesture: predictResult, color: "green"});
        if (appControlThing != controlThing.NONE)
        {
          switch (parseInt(predictResult))
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
        predictPart.clearDatas();
        setTimeout(function () {
          clientSocket.emit('gesture', {currentGesture: gestures.NONE, color: "green"});
        },5000);
        
      });
    });
  }, 3000);
  
});



//received from webpages.

io.on('connection', function (socket) {
  console.log("newClient");
  clientSocket = socket;
  clientSocket.emit('newSGValues', { values : app.locals.SGs.currentValue });
});

app.get('/SGValues', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_SGValues(\'{"values": "'+ app.locals.SGs.currentValue + '"}\')');
});

app.get('/baseSet', function(req, res){
  app.locals.SGs.calibrationBase = app.locals.SGs.currentValue;
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
});

app.get('/changeMode/:mode', function(req, res){
  if (req.params.mode === 'true')
  {
    app.locals.demoMode = true;
  }
  else
  {
    app.locals.demoMode = false;
  }
  console.log(app.locals.demoMode);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
});

//Tranning Functions

app.get('/trainning/sync', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_testcb(\'{"currentGesture": "'+ trainningPart.currentGesture +'","demoMode" : "'+ app.locals.demoMode +'" , "finished" : "'+ trainningPart.finished +'", "calibrationBase" : "'+ app.locals.SGs.calibrationBase +'"}\')');
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

app.get('/predict/sync', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_testcb(\'{"currentGesture": "'+ gestures.NONE +'","demoMode" : "'+ app.locals.demoMode +'" , "finished" : "'+ trainningPart.finished +'", "calibrationBase" : "'+ app.locals.SGs.calibrationBase +'"}\')');
});

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
        switch (parseInt(predictResult))
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
      predictPart.clearDatas();

      
    });
  });
  
});

app.get('/predict/reset', function(req, res){
  predictPart.clearDatas();
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_testcb(\'{"message": "ok"}\')');
});

app.get('/demoDevice/:device',function (req, res) {
  if (parseInt(req.params.device) === appControlThing)
  {
    return;
  }
  if (appControlThing === controlThing.PHONE)
  {
    smartPhoneControl.disconnect();
  };

  if (appControlThing === controlThing.WATCH)
  {
    smartWatchControl.disconnect();
  };

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
      console.log("hah");
      smartPhoneControl.connect();
      break;
    case controlThing.WATCH:
      appControlThing = controlThing.WATCH;
      smartWatchControl.connect();
      break;
  }
  
});

app.get('/demo/:gesture',function (req, res) {
  console.log("gesture: " + req.params.gesture);

  clientSocket.emit('gesture', {currentGesture: req.params.gesture, color: "green"});

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

  setTimeout(function () {
    clientSocket.emit('gesture', {currentGesture: gestures.NONE, color: "green"});
  },5000);

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_testcb(\'{"message": "ok"}\')');
});
