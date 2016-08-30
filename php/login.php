<?php
define('__SCRIPT_ROOT', dirname(__FILE__));
include_once(__SCRIPT_ROOT . '/lib/Database.php');
error_reporting(E_ERROR | E_WARNING | E_PARSE);

$twitterDatabase =
    new Database('twitter-db', 'admin', 'admin1234', '127.0.0.1', '3306', 'pdo_mysql');
$courseArray = array();
$user = (string) $_POST["user"];
$password = (string)$_POST["password"];
$TERM_NUMBER = array();
$twitterDatabase->executeQuery("SELECT ACAD_TERM_CD
                            FROM twitter-db.SR_TERM_V
                            WHERE DATE (NOW() + INTERVAL 1 DAY) BETWEEN twitter-db.SR_TERM_V.ACAD_TERM_BEG_DT AND twitter-db.SR_TERM_V.ACAD_TERM_END_DT;",
                                $TERM_NUMBER);


$TERM_NUMBER = $TERM_NUMBER['0']['ACAD_TERM_CD'];
$sql = "SELECT twitter-db.Person.Forename,
  twitter-db.Person.Surname,
  twitter-db.Person.ID
FROM twitter-db.Person
WHERE (twitter-db.Person.ID = '$password')
  AND (twitter-db.Person.NetworkID = '$user')";
$twitterDatabase->executeQuery($sql,
                           $courseArray);
if (count($courseArray) > 0) {
    echo json_encode($courseArray);
}  else {
    echo false;
}