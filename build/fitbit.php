<?php
  //headers for development on localhost, maybe don't leave in final version?
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
  ini_set('display_errors', 'on'); 
  error_reporting(E_ALL); 
  //not sure why this is necessary, something about how the data had to be passed
  $json = file_get_contents('php://input');
  $values = json_decode($json, true);

  if ($values["action"] == "get_fb") {
    $id = $values["user_id"];
    $mysqli = new mysqli("localhost", "querydude", "mbcoreqdude", "mbcore");

    $result = $mysqli->query("SELECT fitbit_token, client_id FROM userauth WHERE userid = '$id'");

    if ($result) {
      if ($result->num_rows == 1) {
        $fetch = $result->fetch_assoc();
        $fb_token = $fetch["fitbit_token"];
        $c_id = $fetch["client_id"];

        echo $fb_token.":".$c_id;
      }
      else
        echo "Incorrect userid: ".$id;

      $result->close();
    }
    else
      echo "Mysql Error.";

    $mysqli->close();
  }
  exit;
?>