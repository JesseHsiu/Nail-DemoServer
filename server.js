//==== trainning part ====
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var shell = require('shelljs');
var fs = require('fs');
var csv = require("fast-csv");


app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', function(req, res){
   // res.render('index.html');
   res.sendFile(__dirname + '/index.html');
});


app.listen(3000);



//==== trainning part ====

shell.cd('data')
shell.cd('origin')

shell.exec('python main.py', {silent:true}).output;

shell.cd('..')
shell.cd('calculated') 
shell.exec('python main.py', {silent:true}).output;
shell.exec('python csv2libsvm.py', {silent:true}).output;


//==== predict part ====

shell.cd('..')
shell.cd('mlFiles')
shell.exec('svm-scale trainning.ml > trainning.ml.scale', {silent:true}).output;
shell.exec('svm-scale needToPredict.ml > needToPredict.ml.scale', {silent:true}).output;
shell.exec('python main.py', {silent:true}).output;
shell.cd('..')
shell.cd('..')

fs.readFile('./data/mlFiles/needToPredict.ml.predict', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  data = data.split("\n");
  resultOfML = data[0].replace(/\s/g, "X");

  console.log(resultOfML);

});


//==== storing data part --- Trainning ====
var gettingNewString = "0 10 11 12 13 14 15 16 17 18"


// TODO: need to identify current swipe gesture, times.


currentSwipe = 5
currentTime = 5
calibrationBase = [1,1,1,1,1,1,1,1,1]




needToStoreData = gettingNewString.split(" ")
console.log(needToStoreData)

var csvStream = csv.createWriteStream({headers: true}),
writableStream = fs.createWriteStream("./data/origin/T"+ currentTime + "_d"+ currentSwipe  + ".csv");
writableStream.on("finish", function(){
  console.log("DONE!");
});
 
csvStream.pipe(writableStream);
for (var i = 0; i < 100; i++) {
	csvStream.write({sg0: needToStoreData[1] - calibrationBase[0], sg2: needToStoreData[2] - calibrationBase[1], sg3: needToStoreData[3] - calibrationBase[2], sg4: needToStoreData[4] - calibrationBase[3], sg5: needToStoreData[5] - calibrationBase[4], sg6: needToStoreData[6] - calibrationBase[5], sg7: needToStoreData[7] - calibrationBase[6], sg8: needToStoreData[8] - calibrationBase[7], sg9: needToStoreData[9] - calibrationBase[8]});
};
csvStream.end();


////==== storing data part --- Predict ====









// === GET SG VALUES PART ===

var foo = function() {
  console.log("Foo Called");
};

app.post('/', function(req, res) {
  console.log(req.rawHeaders);
  foo();
  res.sendStatus(200);
});