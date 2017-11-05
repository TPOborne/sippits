$(document).ready(function() {
    $("#joinGame").click(function(event) {
        event.preventDefault();
        var gameCode = $("#gameCode").val();
        var name = $("#name").val();
        var data = {gameCode: gameCode, name: name};
        $.ajax({
            url: "php/dbc.php",
            type: "post",
            data: data ,
            success: function (response) {
               // you will get response from your php page (what you echo or print)                 
                console.log(response);
            },
            error: function(response) {
               console.log(response);
            }
        });
    });
});


