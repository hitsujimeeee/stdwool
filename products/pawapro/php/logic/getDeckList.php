<?php
require_once '../global.php';
require_once '../userCommonModule.php';
$userName = '';
$password = '';
if(isset($_POST['userName'])) {
	$userName = $_POST['userName'];
}

if(isset($_POST['password'])) {
	$password = $_POST['password'];
}

$list = array();


$dbh = DB::connect();
try{
	$userId = getID($dbh, $userName, $password);
	if($userId !== null) {
		$sql = "
        SELECT
			D.ID,
			D.USER_ID,
			D.NAME,
			D.CHARA1_ID,
			D.CHARA2_ID,
			D.CHARA3_ID,
			D.CHARA4_ID,
			D.CHARA5_ID,
			D.CHARA6_ID
        FROM
			DECK D
        WHERE
			USER_ID = :userId
        ";
		$stmt = $dbh->prepare($sql);
		$stmt -> bindParam('userId', $userId);
		$stmt->execute();

		while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

			$list[] = array(
				'id'=>$row['ID'],
				'userId'=>$row['USER_ID'],
				'name'=>$row['NAME'],
				'chara'=>array(
				$row['CHARA1_ID'],
				$row['CHARA2_ID'],
				$row['CHARA3_ID'],
				$row['CHARA4_ID'],
				$row['CHARA5_ID'],
				$row['CHARA6_ID']
			),
				'training'=>[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			);
		}

		$stmt = null;

		for ($i = 0; $i < count($list); $i++) {
			foreach ($list[$i]['chara'] as $c) {
				if($c === null) continue;
				$sql = '
				SELECT
					*
				FROM
					EVENT_CHARACTER
				WHERE
					ID = :id';
				$stmt = $dbh->prepare($sql);
				$stmt -> bindParam('id', $c);
				$stmt->execute();

				$row = $stmt->fetch(PDO::FETCH_ASSOC);
				if($row['TRAINING_TYPE'] !== null) {
					$trainingType = $row['TRAINING_TYPE'];
					if(strlen($trainingType) > 1) {
						$split = str_split($trainingType);
						foreach ($split as $s) {
							$list[$i]['training'][(int)$s]++;
						}
					} else {
						$list[$i]['training'][(int)$trainingType]++;
					}
				}
			}
		}
	}



}catch (PDOException $e){
	die();
}

$dbh = null;

header('Content-type: application/json');
echo json_encode($list);

?>
