<!DOCTYPE html>
<html lang="ja">

	<head>
		<?php
		$title = 'パワプロアプリ　その他のツール';
		$description = 'パワプロアプリ育成シミュレーター作者が作った細々したツールを置いています。';
		require_once './headInclude.php';
		?>
	</head>
	<style>
		p.item {
			margin-left: 1em;
		}

		section.mainSection {
			margin-top: 1em;
		}
	</style>
	<body>
		<?php include('../php/header.php'); ?>

		<main>
			<header class="pageHeader">
				<h2><i class="fa fa-wrench" aria-hidden="true"></i>その他ツール</h2>
			</header>
			<section class="mainSection">
				<p class="item">・<a href="../data/vampGauge.zip">ヴァンプ高校 ブラッドゲージ管理ツール</a></p>
			</section>
			<section class="mainSection">
				<p class="item">・<a href="./blankCountSimulate.php">査定調査お助けくん</a></p>
			</section>
			<section class="mainSection">
				<p class="item">・<a href="./epicMemo.php">円卓高校エピックメモ</a></p>
			</section>
		</main>

		<?php include('./optionMenu.php'); ?>

		<?php include('../html/footer.html'); ?>
	</body>

</html>
