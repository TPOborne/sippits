<?php
session_start();
$gameCode = "";
$name = "";
if (isset($_SESSION['gameCode'])) {
    if (isset($_SESSION['name'])) {
        $gameCode = $_SESSION['gameCode'];
        $name = $_SESSION['name'];
    }
}
?>
<!DOCTYPE HTML>
<html>
    <head>
        <title>Sippits</title>
        <link rel="stylesheet" href="css/main.css" type="text/css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div class="contents">
            <div class="loginContainer">
                <h2>Sippits</h2>
                <form>
                  <div class="form-group">
                    <label for="gameCode">Game Code</label>
                    <input type="text" class="form-control" id="gameCode" placeholder="ABC" value="<?php echo $gameCode; ?>">
                  </div>
                  <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" value="<?php echo $name; ?>">
                  </div>
                  <button type="submit" class="btn btn-primary" id="joinGame">Join</button>
                  <button type="submit" class="btn btn-primary" id="createGame">Create</button>
                </form>
            </div>
            <div class="waitingRoom">
                <h2 class="gameCodeWR"></h2>
                <input type="hidden" id="hiddenGameCode" value="<?php echo $gameCode; ?>">
                <ul class="players list-group">
                    
                </ul>
            </div>
            
            <div class="nightMode">
            </div>
            
            <div class="dayMode">
            </div>
        </div>
        
        <script src="js/scripts.js"></script>
    </body>
</html>