<!DOCTYPE html>
<html lang="ja">

<head>
	<?php
	$title = 'パワプロアプリ　デッキシェア';
	$description = 'パワプロアプリの育成シミュレーターです。目標能力までに必要な経験点を計算できます。';
	require_once './headInclude.php';
	?>
	<link rel="stylesheet" href="../css/deckShare.css">
</head>

<body>
	<?php include('../php/header.php'); ?>

	<main>
		<h2>デッキシェア</h2>
		<section class="menuContainer">
			<div class="linkBoxWrapper" id="deckSearch">
				<a href="./deckSearch.php">
					<div class="linkBox">
						<div class="linkText">探す</div>
					</div>
				</a>
			</div>
			<div class="linkBoxWrapper" id="deckList">
				<a href="./deckList.php">
					<div class="linkBox">
						<div class="linkText">作る</div>
					</div>
				</a>
			</div>
		</section>
	</main>

	<?php include('../html/footer.html'); ?>
</body>

</html>
