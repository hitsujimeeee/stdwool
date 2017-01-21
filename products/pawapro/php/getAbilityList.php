<?php
require_once 'global.php';
function getAbilityList ($pageType) {
	$data = array();
	$category_str = $pageType === 0 ? '\'0\', \'1\', \'2\', \'3\', \'5\', \'7\', \'9\'' : '\'4\', \'6\', \'7\', \'8\'';
	try{
		$dbh = DB::connect();

		$sql = 'SELECT ID, NAME, CATEGORY, PAIR
			FROM ABILITY_HEADER
			WHERE CATEGORY IN (' . $category_str . ')
			ORDER BY SORT_ORDER
			';
		// SQL の実行
		$sth = $dbh->query($sql);

		while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			$data[] = array(
				'id'=>$row['ID'],
				'name'=>$row['NAME'],
				'category'=>$row['CATEGORY'],
				'pair'=>$row['PAIR']
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
