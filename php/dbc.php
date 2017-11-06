<?php
include 'conn.php'; 

if (!isset($_POST['action'])) {
    echo "AJAX request is missing action";
} else {
    $action = $_POST['action'];
    
    //JOIN GAME
    if ($action == "joinGame") {
        $gameCode = $_POST['gameCode'];
        $name = $_POST['name'];
        if (empty($gameCode) || empty($name)) {
            echo "One or more fields are empty\n";
        } else {
            //check database entry exists
            $sql = "SELECT * FROM games WHERE game_code = '$gameCode'";
            $result = $con->query($sql);
            $row = $result->fetch_assoc();
            $gameId = $row['game_id'];
            if ($result->num_rows == 0) {
                echo "Invalid Game Code\n";
            } else {
                session_start();
                $_SESSION["gameCode"] = $gameCode;
                $_SESSION["gameId"] = $gameId;
                $_SESSION["name"] = $name;
                echo "success";
                //insert into players
                $sql = "INSERT INTO players (game_id, player_name) VALUES ('$gameId', '$name')";
                $con->query($sql) or die(mysqli_error($con));
            }
        }
    }
    
    
}



/*

$sql = "SELECT * FROM games WHERE game_code = '$gameCode'";
$result = $con->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["game_id"]. " - active: " . $row["active"];
    }
} else {
    echo "0 results";
}
*/


$con->close();