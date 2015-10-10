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
var commandCenter = require('./commandCenter.js');

//==== State Machine ====
var stateMachine = {
  IDLE: 0,
  RECORDING: 1,
  DEMOING: 2,
};

var controlThing = {
  NONE: 0,
  SMARTTV: 1,
  PHONE: 2,
  WATCH: 3,
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


