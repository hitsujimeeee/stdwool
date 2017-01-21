<?php
require_once 'global.php';

$data = array();
$post = null;

$json = file_get_contents('php://input');
$post = json_decode($json, true);
$ability = $post['ability'];
$result = array();
try{
	$dbh = DB::connect();

	$dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

	for ($i = 0; $i < count($ability); $i++) {
		for ($j = 0; $j < count($ability[$i]); $j++) {
			if ($ability[$i][$j]) {
				$sql = 'SELECT ID, NAME, TYPE
						FROM ABILITY_DETAIL
						WHERE ID = ?
						';
				$sth = $dbh->prepare($sql);

				$sth->bindParam(1, $ability[$i][$j], PDO::PARAM_INT);
				// SQL の実行
				$sth->execute();
				$row = $sth->fetch(PDO::FETCH_ASSOC);
				$ability[$i][$j] = array(
					'id'=>$row['ID'],
					'name'=>$row['NAME'],
					'type'=>$row['TYPE']
				);
			}
		}
	}

}catch (PDOException $e){
	print('Error:'.$e->getMessage());
	die();
}

$dbh = null;
header('Content-Type: application/json');
echo json_encode($ability);
//echo null;
?>
