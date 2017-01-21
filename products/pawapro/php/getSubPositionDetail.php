<?php

require_once 'global.php';
$data = array();

$json = file_get_contents('php://input');
$post = json_decode($json, true);
$target = $post['data'];

try{
	$dbh = DB::connect();

	$sql = 'SELECT D.ID, D.NAME, H.COLOR
			FROM SUBPOSITION_HEADER H
			INNER JOIN SUBPOSITION_DETAIL D
			ON H.ID = D.HEADER_ID
			WHERE H.ID = ?
			ORDER BY H.ID';

	$sth = $dbh->prepare($sql);

	$sth->bindParam(1, $target, PDO::PARAM_INT);
	// SQL の実行
	$sth->execute();

	while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
		$data[] = array(
			'id'=>$row['ID'],
			'name'=>$row['NAME'],
			'color'=>$row['COLOR']
		);
	}

}catch (PDOException $e){
	print('Error:'.$e->getMessage());
	die();
}

$dbh = null;
header('Content-Type: application/json');
echo json_encode($data);


//IDを引数に特能情報を取得
function getAbility($data, $id) {
	foreach($data as $row) {
		if ($row['id'] == $id) {
			return $row;
		}
	}
	return null;
}


?>
