<?php
  
  include('./config.php');
  $mysqli = new mysqli(HOSTNAME,USERNAME,PASSWORD,DATABASENAME);

  function isConnected() {
    if ($mysqli->connect_errno) {
      echo "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
      return false;
    } else return true;
  }

  function query($m, $q) {
    $result = $m->query($q);
    return $result ? $result->fetch_all() : false;
  }
  
?>