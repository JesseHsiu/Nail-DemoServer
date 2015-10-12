//==== Import Modules ====
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var robot = require("robotjs");

var gestures = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
  TAP: 4,
  STOP: 5
};

app.use( bodyParser.json() ); 
// app.use(express.static('public'));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.listen(3000);

app.post('/', function(req, res) {
  // console.log(req.rawHeaders);
  // handlerForNewData(req.rawHeaders);
  
  switch(parseInt(req.body.msg))
  {
  	case gestures.UP:
  		robot.keyTap("up");
  		break;
  	case gestures.RIGHT:
  		robot.keyTap("right");
  		break;
  	case gestures.DOWN:
  		robot.keyTap("down");
  		break;
  	case gestures.LEFT:
  		robot.keyTap("left");
  		break;
  	case gestures.TAP:
  		robot.keyTap("enter");
  		break;
  	default:
  		break;
  }
  // console.log(req.body.name)
  // console.log(req.body.time)

  res.sendStatus(200);
});