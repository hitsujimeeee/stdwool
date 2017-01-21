<?php
require_once 'global.php';

$data = array();

$json = file_get_contents('php://input');
$post = json_decode($json, true);
$target = $post['data'];

try{
	$dbh = DB::connect();

	$sql = 'SELECT D.ID, D.NAME, D.POWER, D.SPEED, D.TECH, D.SCREWBALL, D.MENTAL, D.UPPER, D.LOWER, D.TYPE, H.PAIR
			FROM ABILITY_HEADER AS H
			INNER JOIN ABILITY_DETAIL AS D
			ON H.ID = D.HEADER_ID
			WHERE H.ID = ?
			ORDER BY FIELD(TYPE, 3, 2, 4, 0, 1, 5),
			(LOWER IS NULL) DESC';

	$sth = $dbh->prepare($sql);

	$sth->bindParam(1, $target, PDO::PARAM_INT);
	// SQL の実行
	$sth->execute();

	while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
		$data[] = array(
			'id'=>$row['ID'],
			'name'=>$row['NAME'],
			'point'=>array((int)$row['POWER'], (int)$row['SPEED'], (int)$row['TECH'], (int)$row['SCREWBALL'], (int)$row['MENTAL']),
			'lower'=>$row['LOWER'],
			'type'=>$row['TYPE'],
			'pair'=>$row['PAIR']
		);
	}

}catch (PDOException $e){
	print('Error:'.$e->getMessage());
	die();
}

$dbh = null;
header('Content-Type: application/json');
echo json_encode($data);

?>
