<?php
require_once '../global.php';
require_once '../userCommonModule.php';

$deckName = $_POST['deckName'];
$targetType = (int)$_POST['targetType'];
$school = (int)$_POST['school'];
$evChara = $_POST['evChara'];
$author = $_POST['author'];
$twitter = $_POST['twitter'];
$sortOrder = (int)$_POST['sortOrder'];
$sortDir = (int)$_POST['sortDir'] === 0 ? 'DESC' : 'ASC';
$favCheck = json_decode($_POST['favCheck']);
$userName = $_POST['userName'];
$password = $_POST['password'];

$data = [];

$list = array();
try{

	$dbh = DB::connect();

	$userId = null;
	if($favCheck) {
		$userId = getId($dbh, $userName, $password);
		if(!$userId) {
			$favCheck = false;
		}
	}

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
		D.CHARA6_ID,
		P.NAME TYPE,
		S.NAME SCHOOL,
		D.AUTHOR,
		D.TWITTER_ID
	FROM
		DECK D
	INNER JOIN
		DECK_PLAYER_TYPE P
	ON
		D.TYPE = P.ID
	INNER JOIN
		SCHOOL S
	ON
		D.SCHOOL = S.ID
	LEFT JOIN (
		SELECT
			DECK_USER_ID, DECK_ID, COUNT(*) C
		FROM
			DECK_FAVORITE
		WHERE
			DELETE_FLAG = 0
		GROUP BY
			DECK_USER_ID, DECK_ID
	) FAV_T
	ON
		D.ID = FAV_T.DECK_ID
	AND
		D.USER_ID = FAV_T.DECK_USER_ID
	";

	if($favCheck && $userId) {
		$sql .= "
		INNER JOIN (
			SELECT
				DECK_USER_ID,
				DECK_ID
			FROM
				DECK_FAVORITE
			WHERE
				FAV_USER_ID = :favUserId
		) F
		ON
			D.USER_ID = F.DECK_USER_ID
		AND
			D.ID = F.DECK_ID
		";
	}

	$sql .= "
	WHERE
		1 = 1";


	if (trim($deckName) !== "") {
		$sql .= "
		AND
			D.NAME LIKE :deckName
		";
	}

	if ($targetType !== 0) {
		$sql .= "
		AND
			D.TYPE = :targetType
		";
	}

	if ($school !== 0) {
		$sql .= "
		AND
			D.SCHOOL = :school
		";
	}

	if ($evChara !== '') {
		$sql .= "
		AND
			(
				D.CHARA1_ID = :evChara
			OR
				D.CHARA2_ID = :evChara
			OR
				D.CHARA3_ID = :evChara
			OR
				D.CHARA4_ID = :evChara
			OR
				D.CHARA5_ID = :evChara
			OR
				D.CHARA6_ID = :evChara
			)
		";
	}

	if (trim($author) !== "") {
		$sql .= "
		AND
			D.AUTHOR = :author
		";
	}

	if (trim($twitter) !== "") {
		$sql .= "
		AND
			D.TWITTER_ID = :twitter
		";
	}

	$sql .= "
	ORDER BY
		";
	switch($sortOrder) {
		case 1:
			$sql .= "D.ENTRY_DATE " . $sortDir;
			break;
		case 2:
			$sql .= "FAV_T.C " . $sortDir;
			break;
		default:
			$sql .= "D.RENEW_DATE " . $sortDir;
			break;
	}
	$sql .= "
	LIMIT 50
	";

	$stmt = $dbh->prepare($sql);

	if(trim($deckName) !== "") {
		$serachDeckName = '%' . $deckName . '%';
		$stmt -> bindParam('deckName', $serachDeckName);
	}
	if($targetType !== 0) {
		$stmt -> bindParam('targetType', $targetType);
	}
	if($school !== 0) {
		$stmt -> bindParam('school', $school);
	}
	if($evChara !== '') {
		$stmt -> bindParam('evChara', $evChara);
	}
	if(trim($author) !== "") {
		$stmt -> bindParam('author', $author);
	}
	if(trim($twitter) !== "") {
		$stmt -> bindParam('twitter', $twitter);
	}
	if ($favCheck && $userId) {
		$stmt -> bindParam('favUserId', $userId);
	}
	//	var_dump($sql);
	$stmt->execute();
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$data[] = array(
			'id'=>$row['ID'],
			'userId'=>$row['USER_ID'],
			'name'=>htmlspecialchars($row['NAME']),
			'chara'=>array(
			$row['CHARA1_ID'],
			$row['CHARA2_ID'],
			$row['CHARA3_ID'],
			$row['CHARA4_ID'],
			$row['CHARA5_ID'],
			$row['CHARA6_ID']
		),
			'author'=>htmlspecialchars($row['AUTHOR']),
			'twitterId'=>htmlspecialchars($row['TWITTER_ID']),
			'targetType'=>$row['TYPE'],
			'school'=>$row['SCHOOL'],
			'training'=>[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		);
	}

	for ($i = 0; $i < count($data); $i++) {
		foreach ($data[$i]['chara'] as $c) {
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
						$data[$i]['training'][(int)$s]++;
					}
				} else {
					$data[$i]['training'][(int)$trainingType]++;
				}
			}
		}
	}

}catch (PDOException $e){
	die();
}

$dbh = null;
header('Content-type: application/json');
echo json_encode($data,JSON_UNESCAPED_UNICODE);
