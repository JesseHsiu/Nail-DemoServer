//==== trainning part ====
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var shell = require('shelljs');
var fs = require('fs');


app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', function(req, res){
   // res.render('index.html');
   res.sendFile(__dirname + '/index.html');
});


app.listen(3000);

fs.readFile('./data/mlFiles/needToPredict.ml.predict', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});

//==== trainning part ====

shell.cd('data')
shell.cd('origin')

shell.exec('python main.py', {silent:false}).output;

shell.cd('..')
shell.cd('calculated') 
shell.exec('python main.py', {silent:false}).output;
shell.exec('python csv2libsvm.py', {silent:false}).output;


// predict result

shell.cd('..')
shell.cd('mlFiles')
shell.exec('svm-scale trainning.ml > trainning.ml.scale', {silent:false}).output;
shell.exec('svm-scale needToPredict.ml > needToPredict.ml.scale', {silent:false}).output;
shell.exec('python main.py', {silent:false}).output;
shell.cd('..')
shell.cd('..')

// /data/mlFiles/needToPredict.ml.predict












// === GET SG VALUES PART ===

var foo = function() {
  console.log("Foo Called");
};

app.post('/', function(req, res) {
  console.log(req.rawHeaders);
  foo();
  res.sendStatus(200);
});