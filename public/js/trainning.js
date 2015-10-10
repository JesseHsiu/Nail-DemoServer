$(document).ready(function() {

    $.ajax({
        url: 'http://127.0.0.1:3000/test',
        dataType: "jsonp",
        jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            obj = JSON.parse(data);
            $("#test").append(obj.message);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
});