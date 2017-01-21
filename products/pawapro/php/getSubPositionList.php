<?php
require_once 'global.php';

function getSubPositionList ($pageType, $tabType) {

	$data = array();
//	$url = debug_backtrace()[0]['file'];
//	$url = substr($url, strrpos($url, '\\')+1);
//	$pageType = $url === 'batter.php' ? 0 : 1;	//batter.php or pitcher.php
	try{
		$dbh = DB::connect();

		$sql = 'SELECT ID, NAME
			FROM SUBPOSITION_HEADER
			WHERE CATEGORY = ?
			ORDER BY SORT_ORDER
		';

		$sth = $dbh->prepare($sql);

		$sth->bindParam(1, $pageType, PDO::PARAM_INT);
		// SQL の実行
		$sth->execute();

		while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			$data[] = array(
				'id'=>$row['ID'],
				'name'=>$row['NAME']
			);
		}
	}catch (PDOException $e){
		print('Error:'.$e->getMessage());
		die();
	}

	$dbh = null;
	$idx = 0;

	for ($i = 0; $i < count($data); $i++) {
		$d = $data[$i];
		echo '<li><a name="subPosition" default="' . $d['name'] . '" href="javascript:commonModule.openSubPositionDetail(' . $tabType . ', ' . $idx . ', ' . $d['id'] . ');">' . $d['name'] . '</a></li>';
		$idx++;
	}

}
?>
