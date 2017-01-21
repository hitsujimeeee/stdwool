var abilityList = <?php
	require_once 'global.php';
	$dbh = DB::connect();

	$sql = 'SELECT
							H.ID HEADER_ID,
							D.ID,
							D.NAME,
							D.LOWER,
							D.ASSESSMENT,
							H.PAIR,
							D.TYPE
						FROM ABILITY_HEADER H
						INNER JOIN ABILITY_DETAIL D
						ON H.ID = D.HEADER_ID
						WHERE CATEGORY IN (\'0\', \'1\', \'2\', \'5\', \'7\')
						ORDER BY H.CATEGORY, H.SORT_ORDER, FIELD(D.TYPE, 3, 2, 4, 0, 1, 5),
						(LOWER IS NULL) DESC';
	$list = array();
	foreach ($dbh->query($sql) as $row) {
		$list[] = array(
			'headerId'=>$row['HEADER_ID'],
			'id'=>$row['ID'],
			'name'=>$row['NAME'],
			'lower'=>$row['LOWER'],
			'assessment'=>$row['ASSESSMENT'],
			'pair'=>(int)$row['PAIR'],
			'type'=>(int)$row['TYPE'],
		);
	}
	echo json_encode($list);
?>;
