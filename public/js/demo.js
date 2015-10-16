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
var timeoutFunction;

$(document).ready(function() {
    $.ajax({
        url: 'http://127.0.0.1:3000/predict/sync',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            updatesFromResponse(data);
            $("#DemoMode").bootstrapSwitch();
            $("#DemoMode").on('switchChange.bootstrapSwitch', function(event, state) {
              $.ajax({
                    url: 'http://127.0.0.1:3000/changeMode/'+ state.toString(),
                    cache: false,
                    timeout: 5000
                });
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
    
});

function testAddData () {
    $.post( "http://127.0.0.1:3000/", { datas: "0 10 11 12 13 14 15 16 17 18" } );
}
function testAddInitData () {
    $.post( "http://127.0.0.1:3000/", { datas: "0 0 0 0 0 0 0 0 0 0" } );
}



function sendStart () {
    // clearTimeout(timeoutFunction);
    $("#instructionAnimation").removeClass();
    $("#instructionAnimation").addClass(animationCSSName[gestures.STOP]);
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

socket.on('gesture', function (data) {
    updatesFromSocket(data);
});
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

function updatesFromSocket (data) {
    console.log(data)
    currentGesture = data.currentGesture;
    color = data.color;
    $("#instructionAnimation").css("background-color", color);
    $("#instructionAnimation").removeClass();
    $("#instructionAnimation").addClass(animationCSSName[currentGesture]);

    switch(parseInt(currentGesture))
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
        case gestures.STOP:
            $("#instructionText").text("Please wait For Start").css('text-align','center');
            break;
        default:
            break;
    }

    // timeoutFunction = setTimeout(function(){
    //     $("#instructionText").text("Please wait For Start").css('text-align','center');
    //     $("#instructionAnimation").removeClass();
    //     $("#instructionAnimation").addClass(animationCSSName[gestures.STOP]);
    // }, 5000);
    if (obj.calibrationBase != undefined)
    {
        setShowingBase(obj.calibrationBase);    
    };

    if (obj.demoMode === "true")
    {
        $("#DemoMode").attr('checked', 'checked');
    }
}


function updatesFromResponse (data) {
    obj = JSON.parse(data);
    // console.log(Boolean(obj.finished))
    currentGesture = parseInt(obj.currentGesture);

    console.log(currentGesture);
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
        case gestures.STOP:
            $("#instructionText").text("Please wait For Start").css('text-align','center');
            break;
        default:
            break;
    }

    // timeoutFunction = setTimeout(function(){
    //     $("#instructionText").text("Please wait For Start").css('text-align','center');
    //     $("#instructionAnimation").removeClass();
    //     $("#instructionAnimation").addClass(animationCSSName[gestures.STOP]);
    // }, 5000);
    if (obj.calibrationBase != undefined)
    {
        setShowingBase(obj.calibrationBase);    
    };

    if (obj.demoMode === "true")
    {
        $("#DemoMode").attr('checked', 'checked');
    }
}

function upTest () {
    $.ajax({
        url: 'http://127.0.0.1:3000/demo/0',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}

function rightTest () {
    $.ajax({
        url: 'http://127.0.0.1:3000/demo/1',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}

function downTest () {
    $.ajax({
        url: 'http://127.0.0.1:3000/demo/2',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}

function leftTest () {
    $.ajax({
        url: 'http://127.0.0.1:3000/demo/3',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}

function tapTest () {
    $.ajax({
        url: 'http://127.0.0.1:3000/demo/4',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}


function demoDeviceNone(){
    $.ajax({
        url: 'http://127.0.0.1:3000/demoDevice/-1',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}
function demoDeviceTV(){
    $.ajax({
        url: 'http://127.0.0.1:3000/demoDevice/0',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}
function demoDeviceWatch(){
    $.ajax({
        url: 'http://127.0.0.1:3000/demoDevice/2',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}
function demoDevicePhone(){
    $.ajax({
        url: 'http://127.0.0.1:3000/demoDevice/1',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
}