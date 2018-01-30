<!DOCTYPE html>
<html lang="ja">

	<head>
		<?php
		$title = 'パワプロアプリ　円卓高校エピックメモ';
		$description = '円卓高校高校で達成済みのエピックをメモするツールです。自動保存機能や次に発生する可能性のあるエピック一覧機能があります。';
		require_once './headInclude.php';
		?>
		<link rel="stylesheet" href="../css/epicMemo.css">
		<script src="../js/epicMemo.js"></script>
	</head>

	<body>
		<?php include('../php/header.php'); ?>

		<main>
			<header class="pageHeader">
				<h2><i class="fa fa-sticky-note" aria-hidden="true"></i>円卓高校エピックメモ</h2>
			</header>
			<section>
				<header class="sectionHeader"><i class="fa fa-cube"></i>達成済みエピック一覧</header>
				<div class="actionArea">
					<button onclick="epicMemo.addRow(true)">行追加</button>
					<button onclick="epicMemo.deleteRow(true)">行削除</button>
					<button onclick="epicMemo.reset()">リセット</button>
				</div>
				<table class="modern epicTable">
					<tr>
						<th>No</th>
						<th class="epicNameArea">エピック</th>
					</tr>
					<tr>
						<th>1</th>
						<td><button class="epicButton"></button></td>
					</tr>
					<tr>
						<th>2</th>
						<td><button class="epicButton"></button></td>
					</tr>
					<tr>
						<th>3</th>
						<td><button class="epicButton"></button></td>
					</tr>
					<tr>
						<th>4</th>
						<td><button class="epicButton"></button></td>
					</tr>
					<tr>
						<th>5</th>
						<td><button class="epicButton"></button></td>
					</tr>
					<tr>
						<th>6</th>
						<td><button class="epicButton"></button></td>
					</tr>
					<tr>
						<th>7</th>
						<td><button class="epicButton"></button></td>
					</tr>
					<tr>
						<th>8</th>
						<td><button class="epicButton"></button></td>
					</tr>
					<tr>
						<th>9</th>
						<td><button class="epicButton"></button></td>
					</tr>
					<tr>
						<th>10</th>
						<td><button class="epicButton"></button></td>
					</tr>
				</table>
			</section>

			<?php
				require_once './logic/getEpicList.php';
				$epicList = getEpicList();
			?>

			<div id="modalWindow" class="remodal" data-remodal-id="modal" data-remodal-options="hashTracking:false, closeOnCancel:false, closeOnConfirm:false, closeOnEscape:false">
				<button class="remodal-close" onclick="epicMemo.closeRemodal()"></button>
				<section>
					<div class="epicTypeTitle"><i class="fa fa-trophy"></i>聖杯ルートエピック</div>
					<hr class="abHr">
					<?= makeEpicList($epicList, 0) ?>
				</section>

				<section>
					<div class="epicTypeTitle"><img src="../img/icon/pawn.gif" class="iconImg">聖遺物エピック</div>
					<hr class="abHr">
					<?= makeEpicList($epicList, 1) ?>
				</section>

				<section>
					<div class="epicTypeTitle"><img src="../img/icon/treasure.gif" class="iconImg">お宝探しエピック</div>
					<hr class="abHr">
					<?= makeEpicList($epicList, 2) ?>
				</section>

				<section>
					<div class="epicTypeTitle"><img src="../img/icon/broom.gif" class="iconImg">清掃エピック</div>
					<hr class="abHr">
					<?= makeEpicList($epicList, 3) ?>
				</section>

				<section>
					<div class="epicTypeTitle"><img src="../img/icon/muscle.png" class="iconImg">レーニングエピック</div>
					<hr class="abHr">
					<?= makeEpicList($epicList, 4) ?>
				</section>

				<section>
					<div class="epicTypeTitle"><i class="fa fa-flash"></i><i class="fa fa-flash"></i>その他エピック</div>
					<hr class="abHr">
					<?= makeEpicList($epicList, 5) ?>
				</section>

				<div class="modalButton">
					<button class="remodal-cancel" onclick="epicMemo.removeItem()">削除</button>
					<button data-remodal-action="confirm" class="remodal-confirm" onclick="epicMemo.closeRemodal()">Close</button>
				</div>
			</div>

		</main>

		<?php include('./optionMenu.php'); ?>

		<?php include('../html/footer.html'); ?>
	</body>

</html>

<?php

function makeEpicList($list, $type) {
	$str = '<ul class="epicList listType' . $type . '">';

	foreach($list as $row) {
		if((int)$row['EPIC_TYPE'] === $type) {
			$str .= '<li><a class="epicItem" data-epictype="' . $row['EPIC_TYPE'] . '">' . $row['NAME'] . '</a>';
		}
	}

	$str .= '</ul>';
	return $str;
}
?>
