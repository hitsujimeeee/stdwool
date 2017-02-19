<!DOCTYPE html>
<html lang="ja">

<head>
	<?php
	$title = 'パワプロアプリ　デッキシミュレーター';
	$description = 'パワプロアプリの育成シミュレーターです。目標能力までに必要な経験点を計算できます。';
	require_once './headInclude.php';
	?>
	<link rel="stylesheet" href="../css/deckShare.css">
</head>

<body>
	<?php include('../php/header.php'); ?>

	<main>
		<h2>デッキシミュレーター</h2>
		<section class="linkBox searchBox">
			<a href="./deckSearch.php">
				<div>
					<div class="linkText">
						<i class="fa fa-search" aria-hidden="true"></i>デッキを探す
					</div>
				</div>
			</a>
		</section>

		<section class="linkBox editBox">
			<a href="./deckList.php">
				<div>
					<div class="linkText">
						<i class="fa fa-wrench" aria-hidden="true"></i>デッキを作る
					</div>
				</div>
			</a>
		</section>


	</main>

	<?php include('../html/footer.html'); ?>
</body>

</html>
