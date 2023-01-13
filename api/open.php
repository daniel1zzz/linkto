<?php

  include('./db_manager.php');
  $id = $_GET['id'];

  if(!$id) {
    echo '{"ok":false}';
  } else if(isConnected()){
    $result = query($mysqli, 'SELECT * FROM `urls` WHERE id=\'' . $id . '\'');
    if(!$result || count($result) == 0) {
      echo '{"ok":false}';
    } else {
      echo '{"ok":true,"link":"' . $result[0][0] . '"}';
    }
  } else {
    echo '{"ok":false,"error":"There was a server error, please try again later!"}';
  }

?>