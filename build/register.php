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

  if ($values["action"] == "register")  {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $mysqli = new mysqli("localhost", "querydude", "mbcoreqdude", "mbcore");
    $fname = $mysqli->real_escape_string($values["fname"]);
    $lname = $mysqli->real_escape_string($values["lname"]);
    $user = $mysqli->real_escape_string($values["user"]);
    $pass = $mysqli->real_escape_string($values["pass"]);
    $fitbit_token = $mysqli->real_escape_string($values["fitbit_token"]);

    //salt and hash help taken from https://stackoverflow.com/a/3273392
    $salt = str_pad((string) rand(1, 1000), 4, '0', STR_PAD_LEFT);
    $hashed_pass = hash("sha512", $pass . $salt) . $salt;

    $result = $mysqli->query("SELECT userid FROM userauth WHERE user = '$user'");

    if ($result) {
      if ($result->num_rows == 0) {
        $unique = false;
        $c = 0;

        while (!$unique && $c < 100) {
          $unique = true;
          $id = substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyz'), 0, 8); //generate random 8 character alphanumeric userid
          try {
            $mysqli->query("INSERT INTO userauth (fname, lname, user, pass, userid, fitbit_token) VALUES ('$fname', '$lname', '$user', '$hashed_pass', '$id', '$fitbit_token')");
          }
          catch (mysqli_sql_exception $e) {
            if ($e->getCode() == 1062) { //duplicate userid
              $unique = false;
              $c++; //only retry 100 times, then throw error
            }
            else
              throw $e;
          }
        }

        if ($c == 100) {
          echo "Couldn't assign a userid, please contact the site administrator.";
        }

        echo "Account successfully created."; 
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