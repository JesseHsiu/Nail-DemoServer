var currentGesture = 0;
var gestures = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
  TAP: 4,
  STOP: 5
};
var animationCSSName = ["animation-bottomUp", "animation-leftRight","animation-upBottom", "animation-rightLeft","animation-tap","animation-stop"];


function testAddData () {
    $.post( "http://127.0.0.1:3000/", { datas: "0 10 11 12 13 14 15 16 17 18" } );
}
function testAddInitData () {
    $.post( "http://127.0.0.1:3000/", { datas: "0 0 0 0 0 0 0 0 0 0" } );
}



function sendStart () {
    $.ajax({
        url: 'http://127.0.0.1:3000/predict/start',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        	$("#instructionAnimation").css("background-color", "red");
            $("#instructionText").text("Please start your gesture...").css('text-align','center');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}


function sendEnd () {
    $("#instructionText").text("Recongizing...").css('text-align','center');

    $.ajax({
        url: 'http://127.0.0.1:3000/predict/end',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            // console.log(data);
            updatesFromResponse(data);
            $("#instructionAnimation").css("background-color", "green");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function startGesture () {
    if ($('#startDemoBtn').hasClass('active') == false)
    {
        $('#startDemoBtn').addClass('active');
        sendStart();
    }
    else
    {
        $('#startDemoBtn').removeClass('active');
        sendEnd();
    }    
}

function clearData () {
    $.ajax({
        url: 'http://127.0.0.1:3000/predict/reset',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function updatesFromResponse (data) {
    obj = JSON.parse(data);
    // console.log(Boolean(obj.finished))
    currentGesture = parseInt(obj.message);
    $("#instructionAnimation").removeClass();
    $("#instructionAnimation").addClass(animationCSSName[currentGesture]);

    switch(currentGesture)
    {
        case gestures.UP:
            $("#instructionText").text("You just Swiped Up").css('text-align','center');
            break;
        case gestures.RIGHT:
            $("#instructionText").text("You just Swiped Right").css('text-align','center');
            break;
        case gestures.DOWN:
            $("#instructionText").text("You just Swiped Down").css('text-align','center');
            break;
        case gestures.LEFT:
            $("#instructionText").text("You just Swiped Left").css('text-align','center');
            break;
        case gestures.TAP:
            $("#instructionText").text("You Just Taped").css('text-align','center');
            break;
        default:
            break;
    }

    setTimeout(function(){
        $("#instructionText").text("Please wait For Start").css('text-align','center');
        $("#instructionAnimation").removeClass();
        $("#instructionAnimation").addClass(animationCSSName[gestures.STOP]);
    }, 5000);
}