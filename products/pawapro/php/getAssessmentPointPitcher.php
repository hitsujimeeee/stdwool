<?php
require_once 'global.php';
require_once "getAssessmentPointFunc.php";

$data = array();
$post = null;

$json = file_get_contents('php://input');
$post = json_decode($json, true);
$ability = $post['ability'];
$basePoint = $post['basePoint'];
$changeBallType = $post['changeBallType'];
$changeBallValue = $post['changeBallValue'];

try{
	$dbh = DB::connect();

	$dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

	$pointList = [
		0, 2660, 2680, 2702, 2742, 2762, 2782, 2822, 2842, 2862,
		2902, 2922, 2942, 2962, 3004, 3024, 3064, 3084, 3104, 3124,
		3164, 3184, 3204, 3246, 3266, 3286, 3326, 3346, 3366, 3406,
		3426, 3446, 3466, 3508, 3528, 3548, 3588, 3608
	];

	//基礎能力の査定値取得
	$basePoint = (int)getAssessmentPointOfBaseAbilityPitcher($dbh, $basePoint);
	$basePoint += (int)getChangeBallAssessmentPoint($dbh, $changeBallType, $changeBallValue);

	if ($basePoint > 100) {
		$basePoint = $pointList[$basePoint-100];
	} else {
		$basePoint = null;
	}

	//特能計算部分
	$abPoint = getAssessmentPointOfAbility($dbh, $ability);


}catch (PDOException $e){
	print('Error:'.$e->getMessage());
	die();
}


$dbh = null;
header('Content-Type: application/json');
echo json_encode(array('basePoint'=>$basePoint, 'abPoint'=>$abPoint));


//IDを引数に特能情報を取得
function getAbility($data, $id) {
	foreach($data as $row) {
		if ($row['id'] === $id) {
			return $row;
		}
	}
	return null;
}

?>
