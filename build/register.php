<?php
  //headers for development on localhost, maybe don't leave in final version?
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

  //not sure why this is necessary, something about how the data had to be passed
  $json = file_get_contents('php://input');
  $values = json_decode($json, true);

  if ($values["action"] == "register")  {
    $mysqli = new mysqli("localhost", "querydude", "mbcoreqdude", "mbcore");
    $fname = $mysqli->real_escape_string($values["fname"]);
    $lname = $mysqli->real_escape_string($values["lname"]);
    $user = $mysqli->real_escape_string($values["user"]);
    $pass = $mysqli->real_escape_string($values["pass"]);

    //salt and hash help taken from https://stackoverflow.com/a/3273392
    $salt = str_pad((string) rand(1, 1000), 4, '0', STR_PAD_LEFT);
    $hashed_pass = hash("sha512", $pass . $salt) . $salt;

    $result = $mysqli->query("SELECT userid FROM userauth WHERE user = '$user'");

    if ($result) {
      if ($result->num_rows == 0) {
        $result = $mysqli->query("SELECT MAX(userid) as max_id FROM userauth");
        if ($result) {
          $fetch = $result->fetch_assoc();
          $max_id = $fetch["max_id"];
          $id = $max_id + 1;
          $mysqli->query("INSERT INTO userauth (fname, lname, user, pass, userid) VALUES ('$fname', '$lname', '$user', '$hashed_pass', '$id')");  
          echo "Account successfully created."; 
        }
        else
          echo "Something went wrong, please contact the site administrator.";
      }
      else
        echo "Username already taken.";

      $mysqli->close();
      $result->close();
      }
      else
        echo "Something went wrong, please contact the site administrator.";
  }
  exit;
?>