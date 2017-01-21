<?php
require_once 'global.php';
require_once "getAssessmentPointFunc.php";


$data = array();
$post = null;
$MAP_MAX_SIZE = 10000;
$CUT_FREQ = 10;
$json = file_get_contents('php://input');
$post = json_decode($json, true);
$basePoint = $post['basePoint'];
$abilityNow = $post['ability'];
//$isCatcher = $post['isCather'];
$map = $post['map'];
$pairList = array();
$maxIndex = 0;
$dbh = DB::connect();

//try {
//
//	$dbh = DB::connect();
//
//	//特能グループ全取得
//	$abilityGroup = array();
//	$sql = '
//			SELECT ID,
//			--NAME,
//			CASE CATEGORY
//				WHEN 0 THEN 1
//				WHEN 1 THEN 1
//				WHEN 2 THEN 1
//				WHEN 3 THEN 1
//				ELSE 0
//			END BATTER_ABILITY,
//			PAIR
//			FROM ABILITY_HEADER
//			ORDER BY ID';
//
//	$sth = $dbh->query($sql);
//
//	while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
//		$abilityGroup[] = array(
//			'id'=>(int)$row['ID'],
//			'flag'=>(int)$row['BATTER_ABILITY'],
//			'pair'=>$row['PAIR']
//		);
//	}
//	$sth = null;
//
//} catch (PDOException $e){
//	print('Error:'.$e->getMessage());
//	die();
//}
//
//foreach($abilityGroup as $ag) {
//	if($ag['pair'] !== null) {
//		$pairList[] = array(
//			'id'=>$ag['id'],
//			'pair'=>(int)$ag['pair']
//		);
//	}
//}
//
//
//
//$maxIndex = 0;
//$maxDisplayValue = 0;
////表示査定値を計算して一番高いものを取得
//for ($i = 0; $i < count($map); $i++) {
//
//	$newBaseAbility = getNewBaseAbility($basePoint, $map[$i][2]);
//	$baseP = getAssessmentPointOfBaseAbility($dbh, $newBaseAbility);
//
//	$newAbilityList = getNewAbility($abilityNow, $map[$i][2]);
//	$abP = getAssessmentPointOfAbility($dbh, $newAbilityList);
//
//
//	$displayValue = $baseP + ((int)($abP/14) * 14);
//	$map[$i]['dispValue'] = $displayValue; //テスト用、消す
//
//	if ($maxDisplayValue === 0 || $displayValue > $maxDisplayValue) {
//		$maxIndex = $i;
//		$maxDisplayValue = $displayValue;
//	}
//
//}


$newBaseAbility = getNewBaseAbility($basePoint, $map[$maxIndex][2]);
$newAbility = getNewDisplayAbility($dbh, $abilityNow, $map[$maxIndex][2], $pairList);
$data = array(
	'baseAbility'=>$newBaseAbility,
	'ability'=>$newAbility
	//		'targetList'=>$targetList
);




$dbh = null;
header('Content-Type: application/json');
echo json_encode($data);






function getNewBaseAbility($baseAbility, $route) {
	$baseTypeStr = array('DA', 'ME', 'PO', 'SP', 'SH', 'DE', 'CA');
	$list = array();
	for ($i = 0; $i < count($baseAbility); $i++) {
		$hitFlag = false;
		for ($j = 0; $j < count($route); $j++) {
			if(is_numeric(substr($route[$j], 0, 1))) {
				continue;
			}

			if(substr($route[$j], 0, 2) === $baseTypeStr[$i]) {
				$hitFlag = true;
				preg_match('/[0-9]+/', $route[$j], $m);
				$list[] = (int)$m[0];
				break;
			}
		}
		if (!$hitFlag) {
			$list[] = $baseAbility[$i];
		}
	}
	return $list;
}

function getNewAbility($ability, $route) {
	$list = array();
	$abilityGroup = $GLOBALS['abilityGroup'];
	foreach ($route as $id) {
		if (is_numeric(substr($id, 0, 1))) {
			preg_match('/^[0-9]+/', $id, $m);
			preg_match('/[A-Z][0-9]+$/', $id, $m2);
			$ability[$m[0]]['id'] = $m2[0];
		}
	}

	foreach ($ability as $ab) {
		if ($ab['id'] !== null) {
			$list[] = $ab['id'];
		}

	}

	return $list;
}


function getNewDisplayAbility($dbh, $ability, $route, $pairList) {
	$list = array();
	foreach ($route as $id) {
		if (is_numeric(substr($id, 0, 1))) {
			preg_match('/^[0-9]+/', $id, $m);
			preg_match('/[A-Z][0-9]+$/', $id, $m2);
			$ability[$m[0]]['id'] = $m2[0];
			$pairId = getPairId($m[0], $pairList);
			if ($pairId !== null) {
				$ability[$pairId]['id'] = null;
			}
		}
	}

	foreach ($ability as $ab) {
		if ($ab['id'] !== null) {
			$sql = 'SELECT NAME, TYPE
					FROM ABILITY_DETAIL
					WHERE ID = ?
					LIMIT 1
			';
			$sth = $dbh->prepare($sql);
			$sth->bindParam(1, $ab['id'], PDO::PARAM_STR);

			// SQL の実行
			$sth->execute();
			$row = $sth->fetch(PDO::FETCH_ASSOC);
			$list[] = array(
				'id'=>$ab['id'],
				'name'=>$row['NAME'],
				'type'=>$row['TYPE']
			);
		} else {
			$list[] = null;
		}
	}
	return $list;

}


//IDを引数に特能情報を取得
function getAbility($data, $id) {
	foreach($data as $row) {
		if ($row['id'] === $id) {
			return $row;
		}
	}
	return null;
}


function getPairId($id, $pairList) {
	for ($i = 0; $i < count($pairList); $i++) {
		if($pairList[$i]['id'] === $id) {
			return $pairList[$i]['pair'];
		}
	}
	return null;
}



?>


