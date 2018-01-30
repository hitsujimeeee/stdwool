<?php
require 'global.php';
function getEpicList () {
	$data = array();

	try{
		$dbh = DB::connect();

		$sql = 'SELECT ID, NAME, EPIC_TYPE
			FROM EPIC_LIST
	';
		// SQL の実行
		$sth = $dbh->query($sql);

		while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			$data[] = array(
				'ID'=>$row['ID'],
				'NAME'=>$row['NAME'],
				'EPIC_TYPE'=>$row['EPIC_TYPE']
			);
		}
	}catch (PDOException $e){
		print('Error:'.$e->getMessage());
		die();
	}

	$dbh = null;
	return $data;
}
?>
