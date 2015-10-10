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
  calibrationBase : [1,1,1,1,1,1,1,1,1]
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

  //! update calibration first
  //! endofTheInput

  var endOfInput = false;

  if (appStateMachine == stateMachine.IDLE)
  {
    return;
  }
  else if (appStateMachine == stateMachine.RECORDING)
  {
    if (endOfInput)
    {
      trainningPart.endOfrecording();
    }
    else
    {
      trainningPart.recordData(datas);  
    }
    
  }
  else if (appStateMachine == stateMachine.DEMOING)
  {
    if (endOfInput)
    {
      predictPart.endOfrecording();
      var predictResult = predictPart.predictOnModel();

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
      predictPart.clearDatas()
    }
    else
    {
      predictPart.recordData(datas);  
    }
  }
  
};

app.post('/', function(req, res) {
  console.log(req.rawHeaders);
  handlerForNewData(req.rawHeaders);
  res.sendStatus(200);
});


