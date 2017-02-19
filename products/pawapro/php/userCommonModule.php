<?php

function getID($dbh, $name, $password) {

	$userList = array();
	$sql = "SELECT ID, NAME, PASSWORD FROM M_USER WHERE NAME = :name";
	$stmt = $dbh->prepare($sql);
	$stmt -> bindParam('name', $name);
	$stmt->execute();
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$userList[] = array(
			'id'=>$row['ID'],
			'name'=>$row['NAME'],
			'password'=>$row['PASSWORD']
		);
	}

	$id = null;
	foreach($userList as $row) {
		if (password_verify($password, $row['password'])) {
			$id = (int)$row['id'];
			break;
		}
	}
	return $id;
}


function makeNewUser ($dbh, $name, $password) {

	$hashpass = password_hash($password, PASSWORD_DEFAULT);
	$sql = 'INSERT INTO M_USER (NAME, PASSWORD) VALUES (:name, :password)';
	$stmt = $dbh->prepare($sql);
	$stmt -> bindParam('name', $name);
	$stmt -> bindParam('password', $hashpass);
	$stmt->execute();

	return getID($dbh, $name, $password);
}


function makeUniqueId() {
	//乱数3桁+uniqid13桁の計15桁の文字列を作成
	$str = substr(str_pad(mt_rand(), 3, 0) . uniqid(), -16);

	return $str;
}

?>
