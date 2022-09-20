<?php
 header("Access-Control-Allow-Origin:same-origin");

 if(!isset($_SESSION['results'])){
  session_set_cookie_params(3600,"/", "localhost");
  session_start();
}

function validateX($x) {
  return isset($x);
}

function validateY($y) {
  $MIN_Y = -3;
  $MAX_Y = 5;

  if (!isset($y)){
    return false;
  }

  return is_numeric($y) && $y > $MIN_Y && $y < $MAX_Y;
}

function validateR($r) {
  return isset($r);
}

function validateForm($x, $y, $r) {
  return validateX($x) && validateY($y) && validateR($r);
}


function checkTriangle($x, $y, $r) {
  return $x <= 0 && $y >= 0 &&
    $y <= 2 * $r * $x + $r / 2;
}

function checkSquare($x, $y, $r) {
  return $x >= 0 && $y >= 0 &&
    $x <= $r && $y <= $r;
}

function checkCircle($x, $y, $r) {
  return $x <= 0 && $y <= 0 &&
    pow($x, 2) + pow($y, 2) <= pow($r, 2);
}

function checkHit($x, $y, $r) { // call after form validation
  $x = intval($x);
  $y = floatval($y);
  $r = intval($r);
  return checkTriangle($x, $y, $r) || checkSquare($x, $y, $r) ||
    checkCircle($x, $y, $r);
}

$x = $_POST['x'];
$y = $_POST['y'];
$r = $_POST['r'];
$timezoneOffset = $_POST['TZ'];

$isValid = validateForm($x, $y, $r);

$isHit = $isValid ? checkHit($x, $y, $r) : false;

$currentTime = date('H:i:s', time()- $timezoneOffset * 60);
$executionTime = round(microtime(TRUE) - $_SERVER['REQUEST_TIME_FLOAT'], 7);

$tmp = json_decode($_SESSION['results']);
if($isValid) {
  $tmp[] = array(
    "x" => $x, "y" => $y, "r" => $r, "isHit" => $isHit, "currentTime" => $currentTime, "executionTime" => $executionTime
  );
}
// $tmp =  array(
  // "x" => $x, "y" => $y, "r" => $r, "isHit" => $isHit, "currentTime" => $currentTime, "executionTime" => $executionTime
// );
$tmp = json_encode($tmp);
$_SESSION['results'] = $tmp;
echo $_SESSION['results'];

?>