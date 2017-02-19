<?php
require_once '../global.php';
require_once '../userCommonModule.php';

if(isset($_POST['userName'])) {
	$userName = $_POST['userName'];
} else {
	exit();
}

if(isset($_POST['password'])) {
	$password = $_POST['password'];
} else {
	exit();
}

if(isset($_POST['deckUserId'])) {
	$deckUserId = $_POST['deckUserId'];
} else {
	exit();
}

if(isset($_POST['deckId'])) {
	$deckId = $_POST['deckId'];
} else {
	exit();
}

$result = null;

try{
	$dbh = DB::connect();
	$userId = getID($dbh, $userName, $password);

	//既に登録済みのユーザー
	if($userId !== null) {
		$sql = "SELECT
					COUNT(*) C
				FROM
					DECK_FAVORITE
				WHERE
					FAV_USER_ID = :userId
				AND
					DECK_USER_ID = :deckUserId
				AND
					DECK_ID = :deckId";
		$stmt = $dbh->prepare($sql);
		$stmt -> bindParam('userId', $userId);
		$stmt -> bindParam('deckUserId', $deckUserId);
		$stmt -> bindParam('deckId', $deckId);
		$stmt->execute();

		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if ((int)$row['C'] === 0) {
			$stmt = null;
			$sql = "INSERT INTO
						DECK_FAVORITE
					(
						FAV_USER_ID,
						DECK_USER_ID,
						DECK_ID
					)
					VALUES
					(
						:userId,
						:deckUserId,
						:deckId
					)";
			$stmt = $dbh->prepare($sql);
			$stmt -> bindParam('userId', $userId);
			$stmt -> bindParam('deckUserId', $deckUserId);
			$stmt -> bindParam('deckId', $deckId);
			$stmt->execute();

			$result = array('status'=>1, 'msg'=>'お気に入り登録しました');
		} else {
			$result = array('status'=>0, 'msg'=>'すでにお気に入り登録済みです');
		}
	}

}catch (PDOException $e){
	die();
}

$dbh = null;
header('Content-type: application/json');
echo json_encode($result);

?>
