<?php
require_once './lib/password.php';

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

?>
