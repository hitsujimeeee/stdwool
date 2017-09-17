<!DOCTYPE html>
<?php
require_once 'global.php';
$dbh = DB::connect();
?>
<html lang="ja">

<head>
	<?php
	$title = 'パワプロアプリ育成シミュレーター | 査定計算機';
	$description = 'パワプロアプリの査定計算ツールです。選手能力を入れると査定値(実査定値、表示査定値)を計算します。';
	require_once './headInclude.php';
	?>
	<link rel="stylesheet" href="../css/assessment.css">
	<script src="../js/assessment.js"></script>
	<script>
		var baseAbilityList = <?php
			$str = '';
			$list = array();
			for($i = 0; $i < 7; $i++) {
				$innerList = array();
				$str .= '[';
				$sql = 'SELECT
							ASSESSMENT
						FROM BASE_POINT_HEADER H
						WHERE TYPE = ' . $i . '
						ORDER BY POINT ASC';
				foreach ($dbh->query($sql) as $row) {
					$innerList[] = (double)$row['ASSESSMENT'];
				}
				$list[] = $innerList;
			}
			echo json_encode($list);
			?>,

			abilityList = <?php
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
			?>,
			rankData = <?php
				$sql = 'SELECT
							POINT_FROM,
							POINT_TO,
							RANK_STR
						FROM
							ASSESSMENT_RANK
						';
				$list = array();
				foreach ($dbh->query($sql) as $row) {
					$list[] = array(
						'pointFrom'=>(int)$row['POINT_FROM'],
						'pointTo'=>(int)$row['POINT_TO'],
						'rankStr'=>$row['RANK_STR']
					);
				}
				echo json_encode($list);
				?>
	</script>
</head>

<body>
	<?php include('../php/header.php'); ?>

	<main>
		<header class="pageHeader">
			<h2><i class="fa fa-calculator"></i>査定計算機</h2>
		</header>
		<section class="basePointSection">
			<p>■基礎能力</p>
			<table class="basePoint modern">
				<tr>
					<th>弾道</th>
					<td><input type="number" class="basePointInput" min="1" max="4" step="1"></td>
				</tr>
				<tr>
					<th>ミート</th>
					<td><input type="number" class="basePointInput" min="1" max="102" step="1"></td>
				</tr>
				<tr>
					<th>パワー</th>
					<td><input type="number" class="basePointInput" min="1" max="100" step="1"></td>
				</tr>
				<tr>
					<th>走力</th>
					<td><input type="number" class="basePointInput" min="1" max="100" step="1"></td>
				</tr>
				<tr>
					<th>肩力</th>
					<td><input type="number" class="basePointInput" min="1" max="100" step="1"></td>
				</tr>
				<tr>
					<th>守備</th>
					<td><input type="number" class="basePointInput" min="1" max="100" step="1"></td>
				</tr>
				<tr>
					<th>捕球</th>
					<td><input type="number" class="basePointInput" min="1" max="100" step="1"></td>
				</tr>
			</table>


		</section>

		<section class="basePointSection">
			<p>■特殊能力</p>
			<div class="groupHeader"><img class="iconGraph" src="../img/icon/bat.png">特能</div>
			<hr class="abHr">
			<ul class="block-grid block-grid-1-2-3 abilityButtonList">
				<?php
				require_once "getAbilityList.php";
				$data = getAbilityList(0);
				$displayIdx = 0;

				for ($i = 0; $i < count($data); $i++) {
					$d = $data[$i];
					if ($d['category'] === '0' || $d['category'] === '1' || $d['category'] === '2') {
						echo '<li idx="' . $d['id'] . '"><a name="ability" default="' . $d['name'] . '" headerId="' . $d['id'] . '" href="javascript:module.openAbilityDetail(' . $displayIdx . ', ' . $d['id'] . ');">' . $d['name'] . '</a></li>';
						$displayIdx++;
					}
				}

				?>
			</ul>

			<div class="groupHeader"><i class="fa fa-user iconGraph" aria-hidden="true"></i>その他特能</div>
			<hr class="abHr">

			<ul class="block-grid block-grid-1-2-3 abilityButtonList">

				<?php
				for ($i = 0; $i < count($data); $i++) {
					$d = $data[$i];
					if ($d['category'] === '5' || $d['category'] === '7') {
						echo '<li idx="' . $d['id'] . '"><a name="ability" default="' . $d['name'] . '" headerId="' . $d['id'] . '" href="javascript:module.openAbilityDetail(' . $displayIdx . ', ' . $d['id'] . ');">' . $d['name'] . '</a></li>';
						$displayIdx++;
					}
				}

				?>
			</ul>
		</section>

		<section>
			<p>■査定</p>
			<div id="assessmentDisplay"></div>
		</section>

	</main>

	<div id="abilityDetail" class="remodal" data-remodal-id="modal" data-remodal-options="hashTracking:false">
		<button class="remodal-close" data-remodal-action="cancel"></button>
		<div id="detailContent">
			<ul id="abilityDetailList" class="block-grid block-grid-1-2 abilityDetailList abilityButtonList"></ul>
		</div>
		<div class="modalButton">
			<button data-remodal-action="confirm" class="remodal-confirm">OK</button>
			<button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>
		</div>
	</div>

	<?php include('../html/footer.html'); ?>
</body>

</html>
