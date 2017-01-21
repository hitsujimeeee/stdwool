<?php
require_once 'global.php';

$data = array();
$post = null;

$json = file_get_contents('php://input');
$post = json_decode($json, true);
$result = array();
try{
	$dbh = DB::connect();

	$dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

	$sql = 'SELECT ID, NAME, TYPE
			FROM ABILITY_DETAIL
			ORDER BY ID
	';
	foreach ($dbh->query($sql) as $row) {

		$data[] = array(
			'id'=>$row['ID'],
			'name'=>$row['NAME'],
			'type'=>$row['TYPE']
		);
	}

}catch (PDOException $e){
	print('Error:'.$e->getMessage());
	die();
}

$total = 0;
foreach ($post as $p) {
	foreach ($data as $d) {
		if($p === $d['id']) {
			$result[] = $d;
		}
	}
}
$dbh = null;
header('Content-Type: application/json');
echo json_encode($result);

?>
