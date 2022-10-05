<?php
  //headers for development on localhost, maybe don't leave in final version?
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

  //not sure why this is necessary, something about how the data had to be passed
  $json = file_get_contents('php://input');
  $values = json_decode($json, true);
  
  print_r($values);
  if ($values["action"] == "login")  {
    $mysqli = new mysqli("localhost", "querydude", "mbcoreqdude", "mbcore");
    $user = $mysqli->real_escape_string($values["user"]);
    $pass = $mysqli->real_escape_string($values["pass"]);

    $result = $mysqli->query("SELECT pass FROM userauth WHERE user = '$user'");
    
    if ($result) {
      $match = $result->num_rows;
      $fetch = $result->fetch_assoc();
      $db_pass = $fetch["pass"];

      $result->close();
      $mysqli->close();

      if ($match == 1)
      {
        $salt = substr($db_pass, -4);
        $hash = substr($db_pass, 0, -4);

        if(hash("sha512", $pass . $salt) == $hash) {
          $_SESSION["loggedin"] = $user;
          echo $_SESSION["loggedin"];
          echo "\nLogin Successful.\n";
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
  return 200;
?>