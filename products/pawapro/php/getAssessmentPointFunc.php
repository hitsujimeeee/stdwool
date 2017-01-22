<?php

//基礎能力の査定値取得
function getAssessmentPointOfBaseAbility($dbh, $basePointAim) {
	$point = 0;
	for ($i = 0; $i < count($basePointAim); $i++) {

		$sql = 'SELECT ASSESSMENT
			FROM BASE_POINT_HEADER
			WHERE TYPE = ?
			AND POINT = ?
			LIMIT 1';

		$sth = $dbh->prepare($sql);

		$sth->bindParam(1, $i, PDO::PARAM_INT);
		$sth->bindParam(2, $basePointAim[$i], PDO::PARAM_INT);

		// SQL の実行
		$sth->execute();
		$row = $sth->fetch(PDO::FETCH_ASSOC);
		$point += $row['ASSESSMENT'];
		$sth = null;
	}
	$point = $point + 7.84 * round($point / 47.04) + 11.27;
	return $point;
}



//基礎能力の査定値取得(総査定値ボーナスを行わない)
function getAssessmentPointOfBaseAbilityRaw($dbh, $basePointAim) {
	$point = 0;
	for ($i = 0; $i < count($basePointAim); $i++) {

		$sql = 'SELECT ASSESSMENT
			FROM BASE_POINT_HEADER
			WHERE TYPE = ?
			AND POINT = ?
			LIMIT 1';

		$sth = $dbh->prepare($sql);

		$sth->bindParam(1, $i, PDO::PARAM_INT);
		$sth->bindParam(2, $basePointAim[$i], PDO::PARAM_INT);

		// SQL の実行
		$sth->execute();
		$row = $sth->fetch(PDO::FETCH_ASSOC);
		$point += $row['ASSESSMENT'];
		$sth = null;
	}
	return $point;
}

//特能の査定値取得
function getAssessmentPointOfAbility($dbh, $abilityAim) {
	$point = 0;
	for($i = 0; $i < count($abilityAim); $i++) {
		$sql = 'SELECT D.ID,
			D.LOWER,
			D.UPPER,
			D.ASSESSMENT,
			D.TYPE
			FROM ABILITY_HEADER H
			INNER JOIN ABILITY_DETAIL D
			ON H.ID = D.HEADER_ID
			WHERE H.ID = (
				SELECT HEADER_ID
				FROM ABILITY_DETAIL
				WHERE ID = ?
				LIMIT 1
			)
		';

		$sth = $dbh->prepare($sql);
		$sth->bindParam(1, $abilityAim[$i], PDO::PARAM_STR);

		// SQL の実行
		$sth->execute();
		$abilityGroup = array();
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			$abilityGroup[] = array(
			'id'=>$row['ID'],
			'lower'=>$row['LOWER'],
			'upper'=>$row['UPPER'],
			'assessment'=>$row['ASSESSMENT'],
			'type'=>$row['TYPE']
			);
		}


		$temp = $abilityAim[$i];

		while($temp) {
			$ability = getAbility($abilityGroup, $temp);
			if($ability['type'] === 2 || $ability['type'] === 3) {
				break;
			}
			$point += $ability['assessment'];
			$temp = $ability['lower'];
		}
	}
	return $point;
}
?>
