<?php
require_once 'global.php';
require_once 'userCommonModule.php';
require_once './lib/password.php';


$json = file_get_contents('php://input');
$post = json_decode($json, true);
$name = $post['name'];
$password = $post['password'];
$charaId = $post['charaId'];
$result = array('status'=>0, 'msg'=>'');
$data = $post['data'];

if($data === null) {
	$result = array('status'=>-1, 'msg'=>'不正な登録値です。登録は失敗しました。');
} else if (!ctype_alnum($name) || !ctype_alnum($password)){
	$result = array('status'=>-1, 'msg'=>'ユーザー名、パスワードは半角英数字で入力してください。');
} else if (strlen($name) < 8 || strlen($password) < 8) {
	$result = array('status'=>-1, 'msg'=>'ユーザー名、パスワードは8文字以上にしてください。');
} else if(strlen($name) > 20 || strlen($password) > 20){
	$result = array('status'=>-1, 'msg'=>'ユーザー名、パスワードは20文字以内にしてください。');
} else {
	$data = json_encode($data);
	$data = gzdeflate($data);

	try{
		$dbh = DB::connect();
		$userId = getID($dbh, $name, $password);

		//既に登録済みのユーザー
		if($userId !== null) {
		} else {
			//未登録ユーザーの場合はユーザーを新規作成
			$hashpass = password_hash($password, PASSWORD_DEFAULT);

			$sql = 'INSERT INTO M_USER (NAME, PASSWORD) VALUES (:name, :password)';
			$stmt = $dbh->prepare($sql);
			$stmt -> bindParam('name', $name);
			$stmt -> bindParam('password', $hashpass);
			$stmt->execute();
			$userId = getID($dbh, $name, $password);
		}


		if(isExistCharacter($dbh, $charaId, $userId)) {
			//既に選手データが存在している場合
			$sql = 'UPDATE M_CHARACTER SET DATA = :data, UPDATE_DATE = NOW() WHERE ID = :id AND USER_ID = :userId';
			$stmt = $dbh->prepare($sql);
			$stmt -> bindParam('data', $data);
			$stmt -> bindParam('id', $charaId);
			$stmt -> bindParam('userId', $userId);
			$stmt->execute();
			$result = array('status'=>1, 'userId'=>$userId, 'charaId'=>$charaId, 'msg'=>'選手情報の更新を行いました。');
		} else {
			//選手データが存在していない場合
			$charaId = makeCharacterId();
			$sql = 'INSERT INTO M_CHARACTER (ID, USER_ID, DATA) VALUES (:id, :userId, :data)';
			$stmt = $dbh->prepare($sql);
			$stmt -> bindParam('id', $charaId);
			$stmt -> bindParam('userId', $userId);
			$stmt -> bindParam('data', $data);
			$stmt->execute();
			$result = array('status'=>1, 'userId'=>$userId, 'charaId'=>$charaId, 'msg'=>'選手情報の登録を行いました。');
		}

	}catch (PDOException $e){
		die();
	}

}

$dbh = null;
header('Content-type: application/json');
echo json_encode($result);
exit;



function isExistCharacter($dbh, $id, $userId) {
	$sql = "SELECT COUNT(*) C FROM M_CHARACTER WHERE ID = :id AND USER_ID = :userId";
	$stmt = $dbh->prepare($sql);
	$stmt -> bindParam('id', $id);
	$stmt -> bindParam('userId', $userId);
	$stmt->execute();
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	if($row['C'] > 0) {
		return true;
	}
	return false;
}

//キャラクターID作成
function makeCharacterId () {

	//乱数2桁+uniqid13桁の計15桁の文字列を作成
	$str = substr(str_pad(mt_rand(), 2, 0) . uniqid(), -15);

	$x16Array = '0123456789abcdef';
	$x64Array = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/';
	$result = '';

	//3桁毎に16進数→2桁64進数に変換
	for($i = 0; $i < strlen($str) / 3; $i++) {
		$partStr = substr($str, $i * 3, 3);
		$num = 0;
		for ($j = 0; $j < strlen($partStr); $j++) {
			$num += strpos($x16Array, $partStr[$j]) * pow(16, strlen($partStr)-1-$j);
		}
		$result .= $x64Array[(int)($num/64)] . $x64Array[(int)($num)%64];
	}

	return $result;
}

?>
