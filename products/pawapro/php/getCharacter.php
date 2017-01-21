<?php

require_once 'global.php';

$json = file_get_contents('php://input');
$post = json_decode($json, true);
$userId = $post['userId'];
$charaId = $post['charaId'];
$nodataFlag = false;
$data = null;

try{
	$dbh = DB::connect();
	//既に登録済みのユーザー
	if($userId !== null) {
		$sql = "SELECT ID, DATA FROM M_CHARACTER WHERE ID = :charaId AND USER_ID = :userId AND DELETE_FLAG = '0'";
		$stmt = $dbh->prepare($sql);
		$stmt -> bindParam('charaId', $charaId, PDO::PARAM_STR);
		$stmt -> bindParam('userId', $userId, PDO::PARAM_INT);
		$stmt->execute();

		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if ($row) {
			$unzip = gzinflate($row['DATA']);
			$charaIdx16 = convertx64Tox16($row['ID']);

			$imgURL = '../img/charaFace/' . substr($charaIdx16, 0, 2) . '/' . $charaIdx16 . '.jpg';
			if (!file_exists($imgURL)) {
				$imgURL = '../img/noface.jpg';
			}

			$data = array(
				'charaId'=>$row['ID'],
				'imgURL'=>$imgURL,
				'data'=>json_decode($unzip)
			);
		} else {
			$nodataFlag = true;
		}
	} else {
		$nodataFlag = true;
	}

}catch (PDOException $e){
	die();
}

if ($nodataFlag) {
	$data = array(
		'charaId'=>null,
		'data'=>null
	);
}

$dbh = null;
header('Content-type: application/json');
echo json_encode($data);

?>
