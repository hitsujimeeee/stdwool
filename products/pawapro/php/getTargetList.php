<?php
require_once 'global.php';
require_once "getAssessmentPointFunc.php";


$data = array();

$json = file_get_contents('php://input');
$post = json_decode($json, true);
$basePoint = $post['basePoint'];
$abilityNow = $post['ability'];
$baseTrickLevel = $post['baseTrickLevel'];
$isCatcher = $post['isCather'];
$nonCatcher = $post['nonCatcher'];
$expPoint = $post['expPoint'];
array_splice($expPoint, 3, 1);
$sense_per= $post['sense'];
$targetList = array();
$magArray = array(1, 0.7, 0.5, 0.4, 0.3, 0.2);
$abilityList = array();
$pairList = array();

$baseTypeStr = array('DA', 'ME', 'PO', 'SP', 'SH', 'DE', 'CA');

try{
	$dbh = DB::connect();

	for($i = 0; $i < count($basePoint); $i++) {

		if($basePoint[$i] === 0) {
			continue;
		}

		$mag = 1 - $baseTrickLevel[$i] * 0.02;

		$sql = '
				SELECT ASSESSMENT
				FROM BASE_POINT_VIEW
				WHERE TYPE = :type
				AND POINT = :nowPoint
		';
		$sth = $dbh->prepare($sql);


		$sth->bindValue('type', $i, PDO::PARAM_INT);
		$sth->bindValue('nowPoint', $basePoint[$i], PDO::PARAM_INT);
		$sth->execute();
		$row = $sth->fetch(PDO::FETCH_ASSOC);
		$sth = null;
		$nowAssessment = (double)$row['ASSESSMENT'];
		$sql = "SELECT
					V.TYPE,
					V.POINT,
					(SELECT SUM(IF(POWER = 0, 0, GREATEST(FLOOR(POWER * {$sense_per} * {$mag}), 1))) FROM BASE_POINT_VIEW WHERE TYPE = :type AND POINT > :nowPoint AND POINT <= V.POINT LIMIT 1) POWER,
					(SELECT SUM(IF(SPEED = 0, 0, GREATEST(FLOOR(SPEED * {$sense_per} * {$mag}), 1))) FROM BASE_POINT_VIEW WHERE TYPE = :type AND POINT > :nowPoint AND POINT <= V.POINT LIMIT 1) SPEED,
					(SELECT SUM(IF(TECH = 0, 0, GREATEST(FLOOR(TECH * {$sense_per} * {$mag}), 1))) FROM BASE_POINT_VIEW WHERE TYPE = :type AND POINT > :nowPoint AND POINT <= V.POINT LIMIT 1) TECH,
					(SELECT SUM(IF(MENTAL = 0, 0, GREATEST(FLOOR(MENTAL * {$sense_per} * {$mag}), 1))) FROM BASE_POINT_VIEW WHERE TYPE = :type AND POINT > :nowPoint AND POINT <= V.POINT LIMIT 1) MENTAL,
					V.ASSESSMENT
				FROM BASE_POINT_VIEW V
				INNER JOIN (
				SELECT
					TYPE, POINT
				FROM
					BASE_POINT_HEADER H
				WHERE
					EXISTS (
						SELECT
							TYPE, MIN(POINT), ASSESSMENT
						FROM
							BASE_POINT_HEADER
						WHERE
							TYPE = H.TYPE
						GROUP BY
							TYPE, ASSESSMENT
						HAVING
							MIN(POINT) = H.POINT
					)
				) A
				ON V.TYPE = A.TYPE
				AND V.POINT = A.POINT
				WHERE V.TYPE = :type
				AND V.POINT > :nowPoint
				GROUP BY V.TYPE, V.POINT
			";
		$sth = $dbh->prepare($sql);


		$sth->bindValue('type', $i, PDO::PARAM_INT);
		$sth->bindValue('nowPoint', $basePoint[$i], PDO::PARAM_INT);

		// SQL の実行
		$sth->execute();
		$set = array();
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			if((int)$row['POWER'] > (int)$expPoint[0] || (int)$row['SPEED'] > (int)$expPoint[1] || (int)$row['TECH'] > (int)$expPoint[2] || (int)$row['MENTAL'] > (int)$expPoint[3]) {
				break;
			}
			$total = (int)$row['POWER'] + (int)$row['SPEED'] + (int)$row['TECH'] + (int)$row['MENTAL'];
			if($total === 0) {
				continue;
			}
			$set[] = array(
				//				'idx'=>(int)$row['TYPE'],
				'id'=>$baseTypeStr[(int)$row['TYPE']] . $row['POINT'],
				'type'=>0,
				'point'=>array((int)$row['POWER'], (int)$row['SPEED'], (int)$row['TECH'], (int)$row['MENTAL']),
				'val'=>(double)$row['ASSESSMENT']-$nowAssessment,
				'eff'=>((double)$row['ASSESSMENT']-$nowAssessment)/(double)$total,
				'total'=>$total
			);
		}
		if(count($set) > 0) {
			usort($set, "compAssessmentEfficiency");
			array_push($targetList, $set);
		}
		$sth = null;
	}

	$catcherPoint = array(0, 0, 0, 0);

	//キャッチャーでない場合に、キャッチャー○用の必要経験点を取得しておく
	if(!$isCatcher) {
		$sql = '
		SELECT
			POWER,
			SPEED,
			TECH,
			MENTAL
		FROM
			SUBPOSITION_DETAIL
		WHERE
			ID = 1
	';
		$sth = $dbh->query($sql);
		$row = $sth->fetch(PDO::FETCH_ASSOC);
		$catcherPoint = array((int)$row['POWER'], (int)$row['SPEED'], (int)$row['TECH'], (int)$row['MENTAL']);
	}


	//特能グループ全取得
	$abilityGroup = array();
	$sql = '
			SELECT ID,
			--NAME,
			CASE CATEGORY
				WHEN 0 THEN 1
				WHEN 1 THEN 1
				WHEN 2 THEN 1
				WHEN 3 THEN 1
				ELSE 0
			END BATTER_ABILITY,
			PAIR
			FROM ABILITY_HEADER
			ORDER BY ID';

	$sth = $dbh->query($sql);

	while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
		$abilityGroup[] = array(
			'id'=>(int)$row['ID'],
			//			'name'=>$row['NAME'],
			'flag'=>(int)$row['BATTER_ABILITY'],
			'pair'=>$row['PAIR']
		);
	}
	$sth = null;

	//ペア特能用一時保存配列
	$pairArray = array();

	for ($i = 0; $i <count($abilityGroup); $i++) {
		if($abilityGroup[$i]['flag'] === 0 || ($abilityGroup[$i]['id'] === 6 && $nonCatcher)) {
			continue;
		}
		$sql = '
			SELECT D.ID,
			--D.NAME,
			D.POWER,
			D.SPEED,
			D.TECH,
			D.MENTAL,
			D.UPPER,
			D.LOWER,
			D.ASSESSMENT,
			D.TYPE
			FROM ABILITY_HEADER H
			INNER JOIN ABILITY_DETAIL D
			ON H.ID = D.HEADER_ID
			WHERE H.ID = ?
			ORDER BY FIELD(D.TYPE, 3, 2, 4, 0, 1) DESC,
			(LOWER IS NULL) DESC';

		$sth = $dbh->prepare($sql);
		$sth->bindParam(1, $abilityGroup[$i]['id'], PDO::PARAM_INT);
		$sth->execute();
		$abilityList = array();
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			$abilityList[] = array(
				'id'=>$row['ID'],
				//				'name'=>$row['NAME'],
				'power'=>$row['POWER'],
				'speed'=>$row['SPEED'],
				'tech'=>$row['TECH'],
				'mental'=>$row['MENTAL'],
				'assessment'=>$row['ASSESSMENT'],
				'upper'=>$row['UPPER'],
				'lower'=>$row['LOWER'],
				'type'=>$row['TYPE']
			);
		}



		$nowState = $abilityNow[$i];

		//現在の特能の状態によってスタート地点($tempId)を変える
		if ($nowState['id'] === null) {
			$tempId = getStartAbility($abilityList);
		} else {
			$ability = getAbility($abilityList, $nowState['id']);
			if((int)$ability['type'] !== 2 && (int)$ability['type'] !== 3) {
				//赤特能の場合は
				$tempId = $ability['upper'];
			} else {
				$tempId = $nowState['id'];
			}
		}
		$set = array();
		$valueList = array(0, 0, 0, 0);
		$assessment = 0;

		//キャッチャー特能の場合、サブポジキャッチャー分の経験点も追加
		if($abilityGroup[$i]['id'] === 6) {
			for($j = 0; $j < count($catcherPoint); $j++) {
				$valueList[$j] += (int)($catcherPoint[$j] * $sense_per);
			}
		}

		//打ち消し合うタイプの特能を既に習得している場合、査定値にマイナス補正を掛ける。
		if($abilityGroup[$i]['pair'] !== null) {
			$pairList[] = array(
				'id'=>$abilityGroup[$i]['id'],
				'pair'=>(int)$abilityGroup[$i]['pair']
			);
			if($abilityNow[$abilityGroup[$i]['pair']]['id'] !== null) {
				$sql = '
					SELECT
						ASSESSMENT,
						TYPE
					FROM
						ABILITY_DETAIL
					WHERE
						ID = ?
					LIMIT 1
				';
				$sth = $dbh->prepare($sql);
				$sth->bindParam(1, $abilityNow[$abilityGroup[$i]['pair']]['id'], PDO::PARAM_STR);
				$sth->execute();
				$row = $sth->fetch(PDO::FETCH_ASSOC);
				$assessment -= (double)$row['ASSESSMENT'];
			}
		}

		while($tempId) {
			$ability = getAbility($abilityList, $tempId);

			//現在の特能が金特かつ金特のコツレベルが0の場合は終了
			if ((int)$ability['type'] === 1 && $nowState['StrickLevel'] === 0) {
				break;
			}

			$mag = (int)$ability['type'] === 1 ? $magArray[$nowState['StrickLevel']] : $magArray[$nowState['trickLevel']];
			$valueList[0] += (int)($ability['power'] * ($sense_per * $mag));
			$valueList[1] += (int)($ability['speed'] * ($sense_per * $mag));
			$valueList[2] += (int)($ability['tech'] * ($sense_per * $mag));
			$valueList[3] += (int)($ability['mental'] * ($sense_per * $mag));
			$assessment += (double)$ability['assessment'];

			$stopFlag = false;
			//手持ちの経験点内に収まるかチェック
			for ($j = 0; $j < count($expPoint); $j++) {
				if ($valueList[$j] > $expPoint[$j]) {
					$stopFlag = true;
				}
			}

			if ($stopFlag === true) {
				break;
			}

			$total = array_sum($valueList);
			if ($total !== 0 && $assessment > 0) {
				$set[] = array(
					//					'idx'=>$i,
					'id'=>$i . $ability['id'],
					'type'=>1,
					'point'=>$valueList,
					'val'=>$assessment,
					'eff'=>$assessment/(double)$total,
					'total'=>$total
				);
			}
			$tempId = $ability['upper'];
			if (!$tempId && ($ability['type'] == '2' || $ability['type'] == '3')) {
				$tempId = getStartAbility($abilityList);
			}
		}
		if(count($set) > 0) {
			//ペア特能の場合は、ペアリスト内にペアの特能がセットがあるかチェック。
			//ある場合はsetに追加する
			if($abilityGroup[$i]['pair'] !== null) {
				$pairExistFlag = false;
				for($j = 0; $j < count($pairArray); $j++) {
					if ($pairArray[$j]['pairId'] === (int)$abilityGroup[$i]['pair']) {
						$set = array_merge($set, $pairArray[$j]['set']);
						$pairExistFlag = true;
						break;
					}
				}
				if(!$pairExistFlag) {
					$pairArray[] = array('pairId'=>$abilityGroup[$i]['id'], 'set'=>$set);
				} else {
					usort($set, "compAssessmentEfficiency");
					array_push($targetList, $set);
				}
			} else {
				usort($set, "compAssessmentEfficiency");
				array_push($targetList, $set);
			}
		}
	}

	usort($targetList, 'compAssessmentEfficiencyAll');

	$backetList = makeBacketList($targetList);
	$baseNowAssessment = getAssessmentPointOfBaseAbilityRaw($dbh, $basePoint);
	$abNowAssessment = getAssessmentPointOfAbility($dbh, getOwnAbilityList($abilityNow));
	$greedyMaxPoint = getGreedyMaxPoint($expPoint, $targetList, $baseNowAssessment, $abNowAssessment);

	$data = array(
		'targetList'=>$targetList,
		'backetList'=>$backetList,
		'greedyMaxPoint'=>$greedyMaxPoint,
		'baseNowAssessment'=>$baseNowAssessment,
		'abNowAssessment'=>$abNowAssessment
	);

}catch (PDOException $e){
	print('Error:'.$e->getMessage());
	die();
}



$dbh = null;
header('Content-Type: application/json');
echo json_encode($data);


function getOwnAbilityList($list) {
	$newList = array();
	foreach($list as $l) {
		if($l['id']) {
			$newList[] = $l['id'];
		}
	}
	return $newList;
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

//特能グループから、起点となる特能を探し、idを返す。
function getStartAbility($list) {
	foreach($list as $row) {
		if ($row['lower'] === null && ($row['type'] === '0' || $row['type'] === '1' || $row['type'] === '4')) {
			return $row['id'];
		}
	}
}



//査定効率でソート用
function compAssessmentEfficiency($v1, $v2) {
	return $v2['val']/$v2['total'] >= $v1['val']/$v1['total'] ? 1 : -1;
}


//全体を査定効率でソート用
function compAssessmentEfficiencyAll($v1, $v2) {
	return $v2[0]['val']/$v2[0]['total'] >= $v1[0]['val']/$v1[0]['total'] ? 1 : -1;
}


//mapの査定値の降順でソート
function compMapAssessment($m1, $m2) {
	return $m2[1] >= $m1[1] ? 1 : -1;
}


//バケットリスト作成
function makeBacketList($list) {
	$backetList = array();
	$backetList[] = array("val"=>0, "total"=>0);

	foreach($list as $row) {
		$backetList[] = array("val"=>$row[0]['val'], "type"=>$row[0]['type'], "total"=>$row[0]['total']);
	}
	return $backetList;
}


//貪欲法の最適評価値を取得
function getGreedyMaxPoint($point, $targetList, $baseNowAssessment, $abNowAssessment) {
	$idx = 0;
	$greedyMaxPoint = 0;
	$asPoint = array(0, 0);
	foreach($targetList as $row) {
		for ($i = 0; $i < count($point); $i++) {
			$point[$i] -= $row[0]['point'][$i];
			if ($point[$i] < 0) {
				$baseAs = $baseNowAssessment + $asPoint[0];
				$abAs = $abNowAssessment + $asPoint[1];
				return $abAs + $baseAs + 7.84 * round($baseAs / 47.04);
			}
		}
		$asPoint[$row[0]['type']] += $row[0]['val'];
	}
	$baseAs = $baseNowAssessment + $asPoint[0];
	$abAs = $abNowAssessment + $asPoint[1];
	return $abAs + $baseAs + 7.84 * round($baseAs / 47.04);
}


?>
