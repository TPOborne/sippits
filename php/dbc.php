<?php
include 'conn.php'; 
session_start();

if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

    if (!isset($_POST['action'])) {
        echo "AJAX request is missing POST action";
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
} else {
    //else its GET
    if (!isset($_GET['action'])) {
        echo "AJAX request is missing GET action";
    } else { 
        $action = $_GET['action'];
        if ($action == "getPlayers") {
            $gameId = $_SESSION["gameId"];
            $sql = "SELECT * FROM players WHERE game_id = '$gameId'";
            $result = $con->query($sql);
            $data = [];
            while($row = $result->fetch_assoc()) {
                array_push($data, $row);
            }
            echo json_encode($data);
        }
    }
}


$con->close();