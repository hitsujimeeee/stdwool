<?php
require_once 'global.php';
require_once 'userCommonModule.php';

$json = file_get_contents('php://input');
$post = json_decode($json, true);
$name = $post['name'];
$password = $post['password'];
$charaList = array();

try{
	$dbh = DB::connect();
	$userId = getID($dbh, $name, $password);
	//既に登録済みのユーザー
	if($userId !== null) {
		$sql = "SELECT ID, DATA FROM M_CHARACTER WHERE USER_ID = '$userId' AND DELETE_FLAG = '0'";
		$stmt = $dbh->prepare($sql);
		$stmt->execute();

		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$unzip = gzinflate($row['DATA']);
			$charaIdx16 = convertx64Tox16($row['ID']);

			$imgURL = '../img/charaFace/' . substr($charaIdx16, 0, 2) . '/' . $charaIdx16 . '.jpg';
			if (!file_exists($imgURL)) {
				$imgURL = '../img/noface.jpg';
			}


			$charaList[] = array(
				'id'=>$row['ID'],
				'imgURL'=>$imgURL,
				'data'=>json_decode($unzip)
			);
		}
		$state = 1;
	} else {
		$state = -1;
	}

}catch (PDOException $e){
	die();
}

$data = array(
	'userId'=>$userId,
	'charaList'=>$charaList
);

$result = array('state'=>$state, 'data'=>$data);

$dbh = null;
header('Content-type: application/json');
echo json_encode($result);
?>
