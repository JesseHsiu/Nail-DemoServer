var currentGesture = 0;
var trainningIsEnd = false;
var gestures = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
  TAP: 4,
  STOP: 5
};
var animationCSSName = ["animation-bottomUp", "animation-leftRight","animation-upBottom", "animation-rightLeft","animation-tap","animation-stop"];

$(document).ready(function() {
    $.ajax({
        url: 'http://127.0.0.1:3000/trainning/sync',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            updatesFromResponse(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
});

function sendStart () {
    $.ajax({
        url: 'http://127.0.0.1:3000/trainning/start',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            $("#instructionAnimation").css("background-color", "red");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function testAddData () {
    $.post( "http://127.0.0.1:3000/", { datas: "0 10 11 12 13 14 15 16 17 18" } );
}
function testAddInitData () {
    $.post( "http://127.0.0.1:3000/", { datas: "0 0 0 0 0 0 0 0 0 0" } );
}



function sendEnd () {
    $.ajax({
        url: 'http://127.0.0.1:3000/trainning/end',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            $("#instructionAnimation").css("background-color", "green");
            updatesFromResponse(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function startTrainning () {
    if ($('#startTrainningBtn').hasClass('disabled')) {
        return;
    };
    if ($('#startTrainningBtn').hasClass('active') == false)
    {
        $('#startTrainningBtn').addClass('active');
        sendStart();
    }
    else
    {
        $('#startTrainningBtn').removeClass('active');
        sendEnd();
    }    
}

function buildModel () {
    if ($('#buildModel').hasClass('disabled')) {
        return;
    };
    $.ajax({
        url: 'http://127.0.0.1:3000/trainning/buildmodel',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            $('#buildModel').addClass('disabled');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function clearData () {
    $.ajax({
        url: 'http://127.0.0.1:3000/trainning/reset',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            $.ajax({
                url: 'http://127.0.0.1:3000/trainning/sync',
                dataType: "jsonp",
                jsonpCallback: "_testcb",
                cache: false,
                timeout: 5000,
                success: function(data) {
                    updatesFromResponse(data);
                    if ($('#buildModel').hasClass('disabled')) {
                        $('#buildModel').removeClass('disabled');
                    };
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert('error ' + textStatus + " " + errorThrown);
                }
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function updatesFromResponse (data) {
    obj = JSON.parse(data);
    console.log(Boolean(obj.finished))
    currentGesture = parseInt(obj.currentGesture);
    $("#instructionAnimation").removeClass();
    $("#instructionAnimation").addClass(animationCSSName[currentGesture]);

    switch(currentGesture)
    {
        case gestures.UP:
            $("#instructionText").text("Please Swipe Up").css('text-align','center');
            break;
        case gestures.RIGHT:
            $("#instructionText").text("Please Swipe Right").css('text-align','center');
            break;
        case gestures.DOWN:
            $("#instructionText").text("Please Swipe Down").css('text-align','center');
            break;
        case gestures.LEFT:
            $("#instructionText").text("Please Swipe Left").css('text-align','center');
            break;
        case gestures.TAP:
            $("#instructionText").text("Please Just Tap").css('text-align','center');
            break;
        default:
            break;
    }

    if (obj.finished === "true")
    {
        $('#startTrainningBtn').addClass('disabled');
    };
    if (obj.calibrationBase != undefined)
    {
        setShowingBase(obj.calibrationBase);    
    };
    

}


