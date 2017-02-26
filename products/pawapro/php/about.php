<!DOCTYPE html>
<?php
require_once 'global.php';
$dbh = DB::connect();
?>
<html lang="ja">

<head>
	<?php
	$title = 'パワプロアプリ育成シミュレーター | このサイトについて';
	$description = 'パワプロアプリの育成シミュレーターです。このページではこのサイトに関する情報を掲載しています。';
	require_once './headInclude.php';
	?>
	<link rel="stylesheet" href="../css/about.css">

</head>

<body>
	<?php include('../php/header.php'); ?>
	<header class="pageHeader">
		<h2><i class="fa fa-home"></i>このサイトについて</h2>
	</header>
	<section>
		<p class="secHeader"><i class="fa fa-window-maximize"></i>ページ紹介</p>
		<hr class="abHr">
		<section class="despBox">
				<header>
					<p><a href="./batter.php"><img class="iconGraph" src="../img/icon/bat.png">野手シミュレーター</a></p>
					<p><a href="./pitcher.php"><img class="iconGraph" src="../img/icon/ball.png">投手シミュレーター</a></p>
				</header>
				<article>
					目標能力までに必要な経験点を計算できます。使い方は<a href="./manual.php">使い方ページ</a>をご参考ください。<br>
					野手シミュレーターでは<strong>実査定値、選手ランク</strong>の計算も可能で、残った経験点から最大の査定になるように計算する<strong>査定最大化機能</strong>もあります。<br>
				</article>
		</section>

		<section class="despBox">
			<header>
				<p><a href="./assessment.php"><i class="fa fa-calculator"></i>査定計算機</a></p>
			</header>
			<article>
				野手のステータスから実査定値、選手ランクを計算するツールです。<br>
				野手シミュレーターから余計な機能を取り除き、査定値計算に特化させています。
			</article>
		</section>

		<section class="despBox">
			<header>
				<p><a href="./characters.php"><i class="fa fa-user"></i>作成選手一覧</a></p>
			</header>
			<article>
				野手シミュレーター、投手シミュレーターで作成し、保存した選手の一覧を閲覧できます。<br>
				選手の保存方法は<a href="./manual.php#saveSection">使い方ページ</a>をご参考ください。<br>
				過去に作成した選手情報を、このページから編集することもできます。
			</article>
		</section>

		<section class="despBox">
			<header>
				<p><a href="./hirameki.php"><i class="fa fa-lightbulb-o"></i>ひらめきシミュレーター</a></p>
			</header>
			<article>
				ブレインマッスル高校のひらめき特訓の確率計算シミュレーターです。<br>
				デッキのキャラクター情報、ロック中情報などを入力し、疑似的にブレインシャッフルを行えます。
			</article>
		</section>

		<section id="contact" class="despBox">
			<header>
				<p><a href="./manual.php"><i class="fa fa-book"></i>使い方</a></p>
			</header>
			<article>
				このサイトの使い方をまとめています。<br>
			</article>
		</section>

		<section class="despBox">
			<header>
				<p><a href="./data.php"><i class="fa fa-folder-open-o"></i>データ一覧</a></p>
			</header>
			<article>
				このサイトで使用している各種能力の経験点、査定値をまとめています。<br>
			</article>
		</section>

	</section>
	<section>
		<p class="secHeader"><i class="fa fa-paper-plane"></i>連絡先</p>
		<hr class="abHr">
		<div class="contactArticle">
			不具合報告・要望投稿掲示板: <a onclick="ga('send', 'event', 'link', 'click', 'board');" href="http://jbbs.shitaraba.net/game/58946/" target="_blank">掲示板</a><br>
			Twitter: <a onclick="ga('send', 'event', 'link', 'click', 'twitter.com/hitsujiPawapro');" href="https://twitter.com/hitsujiPawapro" target="_blank">@hitsujiPawapro</a><br>
		</div>
		<div class="contactMessage">
			不具合、計算結果の間違い、または要望などございましたら上記連絡先までご報告ください。
		</div>
	</section>

	<section>
		<p class="secHeader"><i class="fa fa-link"></i>リンク</p>
		<hr class="abHr">
		<div class="contactArticle">
			<dl class="linkList">
				<dt><a onclick="ga('send', 'event', 'link', 'click', 'mspwpr2.wixsite.com/mspwpr');" href="http://mspwpr2.wixsite.com/mspwpr" target="_blank">細かすぎて伝わらない 査定理論 (とその他いろいろ) の部屋</a>(ms@査定算出ツール公開中さん<a onclick="ga('send', 'event', 'link', 'click', 'twitter.com/mspwpr');" href="https://twitter.com/mspwpr" target="_blank">@mspwpr</a>)</dt>
				<dd>査定理論を細かく解説しています。当サイトの査定計算にはこちらの計算式を使わせていただいています。</dd>
				<dt><a onclick="ga('send', 'event', 'link', 'click', 'pawamatome.web.fc2.com');" href="http://pawamatome.web.fc2.com/" target="_blank">野手版　実査定計算ツール</a>(センス▼@パワプロさん<a onclick="ga('send', 'event', 'link', 'click', 'twitter.com/pawa_xx');" href="https://twitter.com/pawa_xx" target="_blank">@pawa_xx</a>)(更新停止中)</dt>
				<dd>実査定の計算ツールを公開しています</dd>
				<dt><a onclick="ga('send', 'event', 'link', 'click', 'ancal.moo.jp/pwpr/index.php');" href="http://ancal.moo.jp/pwpr/index.php" target="_blank">PWPRアプリSRレーティング</a>(更新停止中)</dt>
				<dd>SRイベキャラを１対１レーティングでみんなで客観的に評価できるサイトです。</dd>
			</dl>
		</div>
	</section>

</body>

</html>

<!-- https://jsfiddle.net/dpgjx1ca/ -->
