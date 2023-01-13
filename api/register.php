<?php
  
  include('./db_manager.php');
  $json = json_decode(file_get_contents('php://input'), true);
  $url = $json['url'];

  if(!$url){
    echo '{"ok":false,"error":"Not found in url parameter"}';
  } else if(isConnected()){
    $result = isRegistered($mysqli, $url);
    if(!$result){
      $result = registerUrl($mysqli, $url);
      if(!$result){
        echo '{"ok":false,"error":"Registration failed!"}';
      } else {
        echo '{"ok":true,"link":"' . $result . '"}';
      }
    } else {
      echo '{"ok":true,"link":"' . $result . '"}';
    }
  } else {
    echo '{"ok":false,"error":"There was a server error, please try again later!"}';
  }

  function generateHash($url){
    return hash('adler32', $url);
  }

  function isRegistered($mysqli, $url){
    $result = query($mysqli, 'SELECT * FROM `urls` WHERE url=\'' . $url . '\'');
    if(!$result || count($result) == 0) return false;
    else return $result[0][1];
  }

  function registerUrl($mysqli, $url){
    $hash = generateHash($url);
    $result = $mysqli->query('INSERT INTO `urls`(`url`, `id`) VALUES (\''. $url. '\', \'' . $hash . '\')');
    if(!$result) return false;
    else return $hash;
  }

?>