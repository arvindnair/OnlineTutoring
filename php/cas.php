<?php
session_save_path('../sessions'); //UPDATE TO YOUR SESSIONS PATH
session_start();
error_reporting(E_ERROR | E_WARNING | E_PARSE);

//THIS FUNCTION GETS THE CURRENT URL
function curPageURL()
{
    $pageURL = 'http';
    if ($_SERVER["HTTPS"] == "on") {
        $pageURL .= "s://";
        if ($_SERVER["SERVER_PORT"] != "443") {
            $pageURL .= $_SERVER["HTTP_HOST"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
        } else {
            $pageURL .= $_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"];
        }
    } else {
        $pageURL .= "://";
        if ($_SERVER["SERVER_PORT"] != "80") {
            $pageURL .= $_SERVER["HTTP_HOST"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
        } else {
            $pageURL .= $_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"];
        }
    }
    return $pageURL;
}//END CURRENT URL FUNCTION


//THIS FUNCTION SENDS THE USER TO CAS AND THEN BACK
function cas_authenticate(){

    $sid = SID; //Session ID #

    //if the last session was over 15 minutes ago
    if (isset($_SESSION['LAST_SESSION']) && (time() - $_SESSION['LAST_SESSION'] > 900)) {
        $_SESSION['CAS'] = false; // set the CAS session to false
    }

    $authenticated = $_SESSION['CAS'];
    $casurl = curPageURL();

    //send user to CAS login if not authenticated
    if (!$authenticated) {
        $_SESSION['LAST_SESSION'] = time(); // update last activity time stamp
        $_SESSION['CAS'] = true;
        $_SESSION['screenName'] = $_POST['screenName'];
        $_SESSION['authenticationMethod'] = 'CAS';
        echo 'https://cas.iu.edu/cas/login?cassvc=IU&casurl='.$casurl.'/../../index.php';
        //header("Location: https://cas.iu.edu/cas/login?cassvc=IU&casurl=$casurl");
        exit;
    }

    if ($authenticated) {
        if (isset($_GET["casticket"])) {
            //set up validation URL to ask CAS if ticket is good
            $_url = 'https://cas.iu.edu/cas/validate';
            $cassvc = 'IU'; //search kb.indiana.edu for "cas application code" to determine code to use here in place of "appCode"

            $params = "cassvc=$cassvc&casticket=$_GET[casticket]&casurl=$casurl"."/../../index.php";
            $urlNew = "$_url?$params";

            //CAS sending response on 2 lines. First line contains "yes" or "no". If "yes", second line contains username (otherwise, it is empty).
            $ch = curl_init();
            $timeout = 5; // set to zero for no timeout
            curl_setopt ($ch, CURLOPT_URL, $urlNew);
            curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
            ob_start();
            curl_exec($ch);
            curl_close($ch);
            $cas_answer = ob_get_contents();
            ob_end_clean();
            //split CAS answer into access and user
            list($access,$user) = split("\n",$cas_answer,2);
            $access = trim($access);
            $user = trim($user);
            //set user and session variable if CAS says YES
            if ($access == "yes") {
                $_SESSION['user'] = $user;
            }//END SESSION USER
        } else if (!isset($_SESSION['user'])) { //END GET CAS TICKET
            echo 'https://cas.iu.edu/cas/login?cassvc=IU&casurl='.$casurl.'/../../index.php';
        }
    }
}//END CAS FUNCTION

cas_authenticate();
////gets the username from the SESSION variable 'user' created by CAS
$username = $_SESSION['user'];

define('__SCRIPT_ROOT', dirname(__FILE__));
include_once('lib/Database.php');
$twitterDatabase =
    new Database('twitter-db', 'admin', 'admin1234', '127.0.0.1', '3306', 'pdo_mysql');
$courseArray = array();
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
WHERE (twitter-db.Person.NetworkID = '$username')";
$twitterDatabase->executeQuery($sql,
    $courseArray);

$name = $courseArray["0"]["Forename"];

//CHANGE THIS LIST TO THE USERS YOU'D LIKE TO HAVE ACCESS
//$users = array("user1", "user2", "user3");
//if(!in_array($username, $users)){
//    die("Sorry you do not have access to this page.");
//}

//UNCOMMENT NEXT 3 LINES IF YOU'D LIKE TO RESTRICT TO A SINGLE USER
//if($username != "user"){
//  die("Sorry you do not have access to this page.");
//}


?>