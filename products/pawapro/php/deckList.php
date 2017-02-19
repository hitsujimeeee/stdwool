
<!DOCTYPE html>
<html lang="ja">

<head>
	<?php
	$title = 'パワプロアプリ | デッキ編集';
	$description = 'パワプロアプリのデッキをシェアする機能です';
	require_once './headInclude.php';
	?>
	<link rel="stylesheet" href="../css/deckList.css">
	<script src="../js/deckList.js"></script>
</head>

<body>

	<?php include('../php/header.php'); ?>

	<main>
		<header class="pageHeader">
			<h2><i class="fa fa-wrench" aria-hidden="true"></i>デッキ編集</h2>
		</header>
		<section>
			<form id="editForm" method="post" action="./deckCreator.php">
				<input type="hidden" id="userName" name="userName" value="">
				<input type="hidden" id="password" name="password" value="">
				<input name="userId" type="hidden">
				<input name="deckId" type="hidden">
			</form>
			<div class="actButton">
				<button onclick="deckList.createNewDeck();">新規作成</button>
			</div>
		</section>

		<section>
			<p>■一覧</p>
			<div class="deckArea">
				<ul id="deckList"></ul>
			</div>
		</section>
	</main>
	<?php include('./optionMenu.php'); ?>

	<?php include('../html/footer.html'); ?>

</body>

</html>
