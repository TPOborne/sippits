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
            if (!isset($_SESSION['playerId'])) {
                $gameCode = $_POST['gameCode'];
                $name = $_POST['name'];
                if (empty($gameCode) || empty($name)) {
                    echo "One or more fields are empty\n";
                } else {
                    //check database entry exists
                    $sql = "SELECT game_id, in_progress FROM games WHERE game_code = '$gameCode'";
                    $result = $con->query($sql);
                    $row = $result->fetch_assoc();
                    $gameId = $row['game_id'];
                    $inProgress = $row['in_progress'];
                    if ($result->num_rows == 0) {
                        echo "Invalid Game Code\n";
                    } else {
                        if ($inProgress == 0) { 
                            //if name exists return error else
                            $sql = "SELECT player_id FROM players WHERE player_name = '$name' AND game_id = '$gameId'";
                            $result = $con->query($sql);
                            if ($result->num_rows == 0) {
                                $_SESSION["gameCode"] = $gameCode;
                                $_SESSION["gameId"] = $gameId;
                                $_SESSION["name"] = $name;
                                echo "success";
                                //insert into players
                                $sql = "INSERT INTO players (game_id, player_name) VALUES ('$gameId', '$name')";
                                $con->query($sql) or die(mysqli_error($con));
                                $sql = "SELECT player_id FROM players WHERE game_id = '$gameId' AND player_name = '$name'";
                                $result = $con->query($sql);
                                $row = $result->fetch_assoc();
                                $playerId = $row['player_id'];
                                $_SESSION["playerId"] = $playerId;
                            } else {
                                echo "Player with that name already exists";
                            }
                        } else {
                            echo "Cannot join. Game is in progress.";
                        }
                    }
                }
            } else {
                /* update player name 
                
                if player name is empty, use session name.
                
                if game code is different that in session, check DB to see if that new game code is active and not in progress.
                    if so: 
                        remove character from old game.
                        destroy all sessions and remake sessions. Join new game with new data.
                    else:
                        do nothing (echo "success")
                */
                
                echo "success";
            }
        }  
        
        //CREATE GAME
        if ($action == "createGame") {
            session_destroy();
            session_start();
            $gameCode = $_POST['gameCode'];
            $name = $_POST['name'];
            if (empty($gameCode) || empty($name)) {
                echo "One or more fields are empty\n";
            } else {
                //check that gameCode isnt active
                $sql = "SELECT active FROM games WHERE game_code = '$gameCode'";
                $result = $con->query($sql);
                $row = $result->fetch_assoc();
                $active = $row['active'];
                if ($result->num_rows != 0 && $active == 1) {
                    echo "Game Code already in use\n";
                } else {
                    //free to use game code
                    $sql = "INSERT INTO games (game_code) VALUES ('$gameCode')";
                    $con->query($sql) or die(mysqli_error($con));
                    $sql = "SELECT game_id FROM games WHERE game_code = '$gameCode'";
                    $result = $con->query($sql);
                    $row = $result->fetch_assoc();
                    $gameId = $row['game_id'];
                    $sql = "INSERT INTO players (game_id, player_name) VALUES ('$gameId', '$name')";
                    $con->query($sql) or die(mysqli_error($con));
                    $_SESSION["gameCode"] = $gameCode;
                    $_SESSION["gameId"] = $gameId;
                    $_SESSION["name"] = $name;
                    $sql = "SELECT player_id FROM players WHERE game_id = '$gameId' AND player_name = '$name'";
                    $result = $con->query($sql);
                    $row = $result->fetch_assoc();
                    $playerId = $row['player_id'];
                    $_SESSION["playerId"] = $playerId;
                    echo "success";
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
            if (isset($_SESSION["gameId"])) {
                $gameId = $_SESSION["gameId"];
                $sql = "SELECT player_id, player_name FROM players WHERE game_id = '$gameId'";
                $result = $con->query($sql);
                $data = [];
                while($row = $result->fetch_assoc()) {
                    array_push($data, $row);
                }
                echo json_encode($data);
            } else {
                echo "session gameId is not set";
            }
        } else {
            echo "Missing Action";
        }
    }
}



$con->close();