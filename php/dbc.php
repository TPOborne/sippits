<?php

if (isset($_POST['name'])) {
    $name = $_POST['name'];
    echo $name." was received.";
} else {
    echo "fart";
}
