<!-- ヘッダー -->
<?php
$urlPadding = '../';
if(basename(realpath("./")) === 'pawapro') {
	$urlPadding = './';
}
?>
<?php include_once($urlPadding . "php/analyticstracking.php") ?>
<header>
	<nav class="navbar navbar-default">
		<div class="container-fluid">
			<div class="navbar-header">
				<a class="navbar-brand" href="<?php echo $urlPadding; ?>">パワプロアプリ育成シミュレーター</a>
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav_target">
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
			</div>
			<div class="collapse navbar-collapse" id="nav_target">
				<ul class="nav navbar-nav">
					<li><a href="<?php echo $urlPadding; ?>php/batter.php">野手シミュ</a></li>
					<li><a href="<?php echo $urlPadding; ?>php/pitcher.php">投手シミュ</a></li>
					<li><a href="<?php echo $urlPadding; ?>php/assessment.php">査定計算機</a></li>
					<li><a href="<?php echo $urlPadding; ?>php/characters.php">作成選手一覧</a></li>
					<li><a href="<?php echo $urlPadding; ?>php/about.php">about</a></li>
					<li><a href="<?php echo $urlPadding; ?>php/manual.php">使い方</a></li>
				</ul>
			</div>
		</div>
	</nav>
</header>
