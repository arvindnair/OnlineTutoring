<?php
define('__SCRIPT_ROOT', dirname(__FILE__));
include_once(__SCRIPT_ROOT . '/lib/Database.php');
error_reporting(E_ERROR | E_WARNING | E_PARSE);

$twitterDatabase =
    new Database('twitter-db', 'admin', 'admin1234', '127.0.0.1', '3306', 'pdo_mysql');