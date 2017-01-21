<!DOCTYPE html>
<html lang="ja">

<head>
	<?php
	$title = 'パワプロアプリ育成シミュレーター | 作成選手一覧';
	$description = 'パワプロアプリの育成シミュレーターです。目標能力までに必要な経験点を計算できます。';
	require_once './headInclude.php';
	?>
	<link rel="stylesheet" href="../css/characters.css">
	<script src="../js/characters.js"></script>
</head>

<body>
	<?php include('../php/header.php'); ?>

	<main>
		<h2>作成選手一覧</h2>
		<section class="userForm">
			<div>ユーザー名:<input id="userName" type="text"></div>
			<div>パスワード:<input id="userPassword" type="text"></div>
			<div><button onclick="getCharacterList()"><i class="fa fa-search fa-fw" aria-hidden="true"></i>データ取得</button></div>
		</section>

		<section id="batterSection">
			<header><img class="iconGraph" src="../img/icon/bat.png">野手</header>
			<div class="table-responsive">
				<table id="batterTable" class="modern">
					<tr>
						<th></th>
						<th>選手名</th>
						<th>守備位置</th>
						<th>弾道</th>
						<th>打</th>
						<th>力</th>
						<th>走</th>
						<th>肩</th>
						<th>守</th>
						<th>補</th>
						<th>査定</th>
						<th></th>
						<th></th>
					</tr>
				</table>
			</div>
		</section>


		<section id="pitcherSection">
			<header><img class="iconGraph" src="../img/icon/ball.png">投手</header>
			<div class="table-responsive">
				<table id="pitcherTable" class="modern">
					<tr>
						<th></th>
						<th>選手名</th>
						<th>守備位置</th>
						<th>球速</th>
						<th>コン</th>
						<th>スタ</th>
						<th>↑</th>
						<th>←</th>
						<th>↙</th>
						<th>↓</th>
						<th>↘</th>
						<th>→</th>
						<th></th>
						<th></th>
					</tr>
				</table>
			</div>
		</section>

		<!--削除確認用モーダルウインドウ-->
		<div id="confirmModal" class="remodal" data-remodal-id="confirmModal" data-remodal-options="hashTracking:false">
			<button data-remodal-action="close" class="remodal-close"></button>
			<div class="remodalMsg"><i class="fa fa-info-circle fa-lg" style="color:#1d9d74"></i>選手情報を削除します。よろしいですか？</div>
			<button data-remodal-action="confirm" class="remodal-confirm">OK</button>
			<button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>
		</div>

	</main>

	<?php include('../html/footer.html'); ?>
</body>

</html>

<!-- https://jsfiddle.net/dpgjx1ca/ -->
