<?php
require_once 'global.php';

$data = array();
$post = null;

$json = file_get_contents('php://input');
$post = json_decode($json, true);
$subPosition = $post['subPosition'];
$result = array();
try{
	$dbh = DB::connect();

	$dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

	for ($i = 0; $i < count($subPosition); $i++) {
		for ($j = 0; $j < count($subPosition[$i]); $j++) {
			if ($subPosition[$i][$j]) {
				$sql = 'SELECT D.ID, D.NAME, H.COLOR
						FROM SUBPOSITION_HEADER H
						INNER JOIN SUBPOSITION_DETAIL D
						ON H.ID = D.HEADER_ID
						WHERE D.ID = ?
						';
				$sth = $dbh->prepare($sql);

				$sth->bindParam(1, $subPosition[$i][$j], PDO::PARAM_INT);
				// SQL の実行
				$sth->execute();
				$row = $sth->fetch(PDO::FETCH_ASSOC);
				$subPosition[$i][$j] = array(
					'id'=>$row['ID'],
					'name'=>$row['NAME'],
					'color'=>$row['COLOR']
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
echo json_encode($subPosition);
//echo null;
?>
