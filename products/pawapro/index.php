<!DOCTYPE html>
<html lang="ja">
<head>
	<?php
	$title = 'パワプロアプリ育成シミュレーター';
	$description = 'パワプロアプリの育成シミュレーターです。目標選手の育成に必要な経験点を計算してくれます。査定計算機能や、余った経験点から査定が最大になるように能力を振ってくれる査定最大化機能もあります。';
	require_once './php/headInclude.php';
	?>
	<link rel="stylesheet" href="./css/index.css">
	<script src="./js/plugin/jquery.fittext.js"></script>
	<script src="./js/index.js"></script>
</head>
<body>
	<?php include('./php/header.php'); ?>

	<main>
		<div><h2 id="title">パワプロアプリ育成シミュレーター</h2></div>
		<div class="flex-container" id="mainMenu">
			<div>
				<div>
					<a href="./php/batter.php"><img src="./img/batter_entrance.jpg" class="mainImage"></a>
				</div>
				<div class="mainLink">
					<a href="./php/batter.php">野手シミュレータ－</a>
				</div>

			</div>
			<div>
				<div>
					<a href="./php/pitcher.php"><img src="./img/pitcher_entrance.jpg" class="mainImage"></a>
				</div>
				<div class="mainLink">
					<a href="./php/pitcher.php">投手シミュレータ－</a>
				</div>
			</div>
		</div>

		<div class="otherMenu">
			<ul class="otherMenuList">
				<li><span><a href="./php/assessment.php"><i class="fa fa-calculator fa-fw" aria-hidden="true"></i>査定計算機</a></span></li>
				<li><span><a href="./php/characters.php"><i class="fa fa-user fa-fw" aria-hidden="true"></i>作成選手一覧</a></span></li>
				<li><span><a href="./php/hirameki.php"><i class="fa fa-lightbulb-o fa-fw" aria-hidden="true"></i>ひらめきシミュレーター</a></span></li>
				<li><span><a href="./php/about.php"><i class="fa fa-home fa-fw" aria-hidden="true"></i>このサイトについて</a></span></li>
				<li><span><a href="./php/manual.php"><i class="fa fa-book fa-fw" aria-hidden="true"></i>使い方</a></span></li>
				<li><span><a href="./php/data.php"><i class="fa fa-folder-open-o fa-fw" aria-hidden="true"></i>データ一覧</a></span></li>
				<li><span><a onclick="ga('send', 'event', 'link', 'click', 'board');" href="http://jbbs.shitaraba.net/game/58946/"><i class="fa fa-paper-plane fa-fw" aria-hidden="true"></i>不具合報告・要望投稿掲示板</a></span></li>
			</ul>
		</div>

		<div class="histories">
			<div class="historiesHeader">
				<i class="fa fa-info-circle" aria-hidden="true"></i>新着情報
			</div>
			<div class="historiesRecord">

				<dl class="historyList">
					<?php
					require './php/getHistories.php';
					$data = getHistories();
					$preDate = null;
					foreach ($data as $d) {
						$newClass = '';
						if(!$preDate || ((strtotime(date("Y/m/d")) - strtotime($d['date']))/ (60 * 60 * 24) <= 7 && $preDate == $d['date'])) {
							$newClass = 'newItem';
						}
						echo '<dt>' . date('Y年m月d日', strtotime($d['date'])) . '</dt>';
						echo '<dd class="' . $newClass . '">'. $d['description'] . '</dd>';
						if(!$preDate) {
							$preDate = $d['date'];
						}
					}
					?>
				</dl>
			</div>
		</div>


	</main>
	<?php include('./html/footer.html'); ?>
</body>

</html>
