<?php
session_save_path('./sessions'); //UPDATE TO YOUR SESSIONS PATH
session_start();
if (array_key_exists('screenName',$_SESSION) == true) {
    $authentication = array($_SESSION['screenName'], $_SESSION['authenticationMethod']);
    echo json_encode($authentication);
} else {
    echo 'false';
}