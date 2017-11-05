$(document).ready(function() {
    $("#joinGame").click(function(event) {
        event.preventDefault();
        var gameCode = $("#gameCode").val();
        var name = $("#name").val();
        var action = "joinGame";
        var data = {action: action, gameCode: gameCode, name: name};
        $.ajax({
            url: "php/dbc.php",
            type: "post",
            data: data ,
            success: function (response) { 
                if (response == "success") {
                    console.log(response);
                } else {
                    console.log("Error: " + response);
                }
            }
        });
    });
    
    $("#createGame").click(function(event) {
        event.preventDefault();
        var gameCode = $("#gameCode").val();
        var name = $("#name").val();
        var action = "createGame";
        var data = {action: action, gameCode: gameCode, name: name};
        $.ajax({
            url: "php/dbc.php",
            type: "post",
            data: data ,
            success: function (response) {             
                console.log(response);
            }
        });
    });
});


