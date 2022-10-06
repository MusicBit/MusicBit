<?php
  //headers for development on localhost, maybe don't leave in final version?
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

  //not sure why this is necessary, something about how the data had to be passed
  $json = file_get_contents('php://input');
  $values = json_decode($json, true);
  
  //print_r($values);

  if ($values["action"] == "validate") {
    $token = $values["token"];
    $id = substr($token, -8);
    $token = substr($token, 0, -8);

    $mysqli = new mysqli("localhost", "querydude", "mbcoreqdude", "mbcore");
    $result = $mysqli->query("SELECT user FROM userauth WHERE userid = '$id'");
    if ($result) {
      $match = $result->num_rows;
      $fetch = $result->fetch_assoc();
      $user = strtolower($fetch["user"]);

      $result->close();
      $mysqli->close();

      if ($match == 1) {
        $hash = hash("sha512", $user . $id);
        if ($token == $hash) {
          echo $id;
          exit;
        }
      }
    }
    echo -1;
    exit;
  }

  if ($values["action"] == "login")  {
    $mysqli = new mysqli("localhost", "querydude", "mbcoreqdude", "mbcore");
    $user = $mysqli->real_escape_string($values["user"]);
    $pass = $mysqli->real_escape_string($values["pass"]);

    $result = $mysqli->query("SELECT pass, userid FROM userauth WHERE user = '$user'");
    
    if ($result) {
      $match = $result->num_rows;
      $fetch = $result->fetch_assoc();
      $db_pass = $fetch["pass"];
      $id = $fetch["userid"];

      $result->close();
      $mysqli->close();

      if ($match == 1)
      {
        $salt = substr($db_pass, -4);
        $hash = substr($db_pass, 0, -4);

        if(hash("sha512", $pass . $salt) == $hash) {
          //$_SESSION["loggedin"] = $user;        //this WOULD work on live, but for the sake of development it doesn't, it can't remotely create a session on the local browser
          //echo $_SESSION["loggedin"];
          $token_salt = str_pad($id, 8, '0', STR_PAD_LEFT);
          $token = hash("sha512", strtolower($user) . $token_salt) . $token_salt;
          echo "Login Successful.\n$token";
        }
        else
          echo "Invalid Credentials.";
      }
      else
        echo "Invalid Credentials.";
    }
    else
      echo "Something went wrong, please contact the site administrator.";
  }
  exit;
?>