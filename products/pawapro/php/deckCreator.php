<?php
require_once 'global.php';
require_once './userCommonModule.php';
require_once './lib/Parsedown.php';
$userName = null;
$password = null;
$userId = null;
$deckId = null;
$rarelityList = ['', 'PSR', 'SR', 'PR', 'R', 'PN', 'N'];

$targetTypeList = [];
$schoolList = [];
$dbh = DB::connect();
$sql = 'SELECT NAME FROM DECK_PLAYER_TYPE';
foreach ($dbh->query($sql) as $row) {
	$targetTypeList[] = $row['NAME'];
}


$sql = 'SELECT NAME FROM SCHOOL';
foreach ($dbh->query($sql) as $row) {
	$schoolList[] = $row['NAME'];
}




//0:不正
//1:新規作成
//2:編集
//3:閲覧
$mode = 0;

if(isset($_POST['userName'])) {
	$userName = $_POST['userName'];
}

if(isset($_POST['password'])) {
	$password = $_POST['password'];
}

if(isset($_GET['userId'])) {
	$userId = $_GET['userId'];
}

if(isset($_GET['deckId'])) {
	$deckId = $_GET['deckId'];
}


//不正なアクセス
if ($userName === null && $password === null && $userId === null && $deckId === null) {
	echo 'このページは表示できません。';
	exit;
}

//閲覧モード(ユーザーIDとデッキIDのみの連携)
if (($userName === null || $password === null) && ($userId !== null && $deckId !== null)) {
	$mode = 3;
	$dbUserId = $userId;
}

//新規作成モード(ユーザー名とパスワードのみの連携)
if ($userName && $password && ($userId === null || $deckId === null)) {
	$mode = 1;
}

//更新モード(全情報連携)
if ($userName && $password && $userId && $deckId) {
	$mode = 2;

	$dbUserId = getID($dbh, $userName, $password);
	if($dbUserId !== (int)$userId) {
		echo 'ユーザー名、またはパスワードが違います';
		exit;
	}

}

//不正なアクセス
if ($mode === 0) {
	echo 'このページは表示できません。';
	exit;
}

if($mode === 2 || $mode === 3) {
	require_once './logic/getDeck.php';
	$deckData = getDeck($dbUserId, $deckId);
	$Parsedown = new Parsedown();
	$summary = $Parsedown->setMarkupEscaped(true)->setBreaksEnabled(true)->text($deckData['summary']);
	$totalBonusPoint = getTotalBonusPoint($deckData['lv'], $deckData['rare']);
	if ($mode === 3) {
		$deckEventDetail = getDeckEventDetail($dbh, array($deckData['chara'][0], $deckData['chara'][1], $deckData['chara'][2], $deckData['chara'][3], $deckData['chara'][4], $deckData['chara'][5]));
	}
} else {
	$summary = '';
}

function getBonusCount($lv, $rarelity) {
	$baseLevel = [40, 35, 25, 20, 15, 10];
	if ($lv == null || $rarelity == null){
		return '';
	}
	$dif = $lv - $baseLevel[$rarelity];
	if ($dif <= 0) {
		return '';
	}

	$c = (int)($dif / 2) + ($dif % 2);
	return '+' . $c;
}

function getTotalBonusPoint($lvList, $rareList) {
	$total = 0;
	$baseLevel = [40, 35, 25, 20, 15, 10];
	$perBase = [0.5, 0.25, 0.1, 0.05, 0, 0];
	$perMag = [0.1, 0.05, 0.02, 0.01, 0, 0];
	for ($i = 0; $i < 6; $i++) {
		$lv = $lvList[$i];
		$rare = $rareList[$i];

		if ($lv == null || $rare == null){
			continue;
		}
		$dif = $lv - $baseLevel[$rare];
		if ($dif <= 0) {
			continue;
		}

		$c = (int)($dif / 2);
		$total += $perBase[$rare] + $c * $perMag[$rare];
	}
	return $total;
}

function getDeckEventDetail($dbh, $charaList) {
	$trainingList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	$eventTypeList = [0, 0];
	foreach ($charaList as $c) {
		if($c === null) continue;
		$sql = '
			SELECT
				*
			FROM
				EVENT_CHARACTER
			WHERE
				ID = :id';
		$stmt = $dbh->prepare($sql);
		$stmt -> bindParam('id', $c);
		$stmt->execute();

		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if($row['TRAINING_TYPE'] !== null) {
			$trainingType = $row['TRAINING_TYPE'];
			if(strlen($trainingType) > 1) {
				$split = str_split($trainingType);
				foreach ($split as $s) {
					$trainingList[(int)$s]++;
				}
			} else {
				$trainingList[(int)$trainingType]++;
			}

		}
		$eventTypeList[(int)$row['EVENT_TYPE']]++;
	}
	return array(
		'trainingList'=>$trainingList,
		'eventTypeList'=>$eventTypeList
	);
}
?>

<!DOCTYPE html>
<html lang="ja">

<head>
	<?php
	$title = 'パワプロアプリ | デッキ編集';
	$description = 'パワプロアプリのデッキをシェアする機能です';
	require_once './headInclude.php';
	?>
	<link rel="stylesheet" href="../css/deckCreator.css">
	<script src="../js/deckCreator.js"></script>
	<script>
		var savedCharaList = [
			<?php
			if (isset($deckData)) {
				$str = '';
				for ($i = 0; $i < count($deckData['chara']); $i++) {
					if ($deckData['chara'][$i] === null) {
						break;
					}
					$str .= '{id:\'' . $deckData['chara'][$i] . '\', lv:' . ($deckData['lv'][$i] ? $deckData['lv'][$i] : 'null') . ', rare:' . ($deckData['rare'][$i] ? $deckData['rare'][$i] : 'null') . '}, ';
				}
				substr($str, 0, strlen($str)-2);
				echo $str;
			}
			?>
		];
	</script>
</head>

<body>

	<?php include('../php/header.php'); ?>

	<main>
		<header class="pageHeader">
			<?php if ($mode === 3) { ?>
			<h2><i class="fa fa-retweet" aria-hidden="true"></i>デッキシェア</h2>
			<?php } else { ?>
			<h2><i class="fa fa-wrench" aria-hidden="true"></i>デッキ編集</h2>
			<?php } ?>
		</header>

		<!-- デッキ名 -->
		<section>
			<?php if ($mode === 3) { ?>
			<header><h3><?= htmlspecialchars($deckData['name'])?></h3></header>
			<div class="viewDeckAttribute">
				<div class="viewDeckType">
					<span><?= htmlspecialchars($targetTypeList[$deckData['type']])?></span>
					<p class="arrow_box">対象とする育成選手のタイプです</p>
				</div>
				<div class="viewSchoolType">
					<span><?= htmlspecialchars($schoolList[$deckData['school']])?></span>
					<p class="arrow_box">対象とする高校です</p>
				</div>
				<?php if ($totalBonusPoint > 0) { ?>
				<div class="viewBonusPoint">
					<span>↑<?= $totalBonusPoint ?>%</span>
					<p class="arrow_box">上限開放ボーナスの合計値です</p>
				</div>
				<?php } ?>
			</div>
			<?php } else { ?>
			<header>■デッキ名(30文字まで)</header>
			<p><input type="text" id="deckName" value="<?= htmlspecialchars(isset($deckData) ? $deckData['name'] : '')?>"></p>
			<?php } ?>
			<input type="hidden" id="userId" value="<?= $userId ?>">
			<input type="hidden" id="deckId" value="<?= $deckId ?>">
		</section>

		<!-- イベキャラ選択 -->
		<section>
			<?php if ($mode === 3) { ?>
			<div class="evCharaContainer">
				<ul>
					<?php for ($i = 0; $i < count($deckData['chara']); $i++) {?>
					<li class="eveCharaImg">
						<div class="relative">
							<img src="../img/eventChara/<?= $deckData['chara'][$i] ? $deckData['chara'][$i] . '.jpg' : 'noimage.jpg' ?>">
							<div class="lvText"><?= $deckData['lv'][$i] ? 'Lv' . $deckData['lv'][$i] : '' ?></div>
							<div class="bonusText"><?= getBonusCount($deckData['lv'][$i], $deckData['rare'][$i]) ?></div>
						</div>
					</li>
					<?php } ?>
				</ul>
			</div>

			<!-- デッキの詳細 -->
			<div class="deackDetail">
				<div class="deckTraining">
					<?php for ($i = 0; $i < count($deckEventDetail['trainingList']); $i++) {?>

					<div class="trainingCell"><img class="summaryTrainingIcon<?= ($deckEventDetail['trainingList'][$i] > 0 ? ' nonOpacity' : '') ?>" src="../img/practice<?= $i ?>.jpg">
						<?php if ($deckEventDetail['trainingList'][$i] > 1) { ?>
						<div class="countNum">×<?= $deckEventDetail['trainingList'][$i] ?></div>
						<?php } ?>
					</div>
					<?php } ?>
				</div>
				<div class="eventType">
					<div>前<?= $deckEventDetail['eventTypeList'][0] ?></div>
					<div>後<?= $deckEventDetail['eventTypeList'][1] ?></div>
				</div>
			</div>

			<?php } else { ?>
			<header>■イベキャラ<button onclick="deckCreator.openRemodal();">編集</button></header>
			<div class="evCharaContainer">
				<ul class="contaner">
					<?php for ($i = 0; $i < 6; $i++) { ?>
					<li class="eveCharaImg">
						<div class="eveImageArea" onclick="deckCreator.deleteSelectedEveChara(<?= $i ?>)">
							<img src="../img/eventChara/<?= isset($deckData) && $deckData['chara'][$i] ? $deckData['chara'][$i] . '.jpg' : 'noimage.jpg' ?>">
							<div class="trainingIcon"><img class="trainingIcon hiddenDisplay"></div>
						</div>
						<div>
							<input type="number" class="charaLv" min="1" max="50" value="<?= isset($deckData) && $deckData['lv'][$i] ? $deckData['lv'][$i] : ''?>"<?= !isset($deckData) || !$deckData['chara'][$i] ? ' disabled=true' : '' ?> tabindex="<?= $i+1 ?>">
						</div>
						<div>
							<select class="rareRank"<?= !isset($deckData) || !$deckData['chara'][$i] ? ' disabled=true' : '' ?> tabindex="<?= $i+7 ?>">
								<?php for ($j = 0; $j < 6; $j++) { ?>
								<option value="<?= $j ?>"<?= (isset($deckData) && $deckData['rare'][$i] == $j ? ' selected' : '') ?>><?= $rarelityList[$j] ?></option>
								<?php } ?>
							</select>
						</div>

					</li>
					<?php } ?>
				</ul>
			</div>



		<?php } ?>
		</section>


		<!-- 育成タイプ -->
		<?php if ($mode !== 3) { ?>
		<section>
			<header><i class="fa fa-building-o" aria-hidden="true"></i>育成タイプ</header>
			<p>
				<select id="charaType">
				<?php
					for($i = 0; $i < count($targetTypeList); $i++) {
					echo '<option value="' . $i . '"' . (isset($deckData) && $deckData['type'] == $i ? ' selected' : '') . '>' . $targetTypeList[$i] . '</option>';
					}
				?>
				</select>
			</p>
		</section>
		<?php } ?>

		<!-- 対象高校 -->
		<?php if ($mode !== 3) { ?>
		<section>
			<header><i class="fa fa-building-o" aria-hidden="true"></i>対象高校</header>
			<p>
				<select id="school">
				<?php
					for($i = 0; $i < count($schoolList); $i++) {
					echo '<option value="' . $i . '"' . (isset($deckData) && $deckData['school'] == $i ? ' selected' : '') . '>' . $schoolList[$i] . '</option>';
					}
				?>
				</select>
			</p>
		</section>
		<?php } ?>

		<section>
			<header>■特徴・コンセプト</header>
			<?php if ($mode === 3) { ?>
			<div class="summary"><?= $summary ?></div>
			<?php } else { ?>
			<textarea type="text" class="summary" id="summary" maxlength="500"><?= htmlspecialchars(isset($deckData) ? $deckData['summary'] : '') ?></textarea>
			<p><span id="restTextCount">500</span>/500</p>
			<?php } ?>

		</section>

		<section>
			<header>■一覧</header>
			<input type="text" name="" value="">
		</section>

		<section>
			<header>■作者情報</header>
			<table class="modern authorInfo">
				<tr>
					<th>作者名</th>
					<td>
						<?php if ($mode === 3) { ?>
						<?= htmlspecialchars($deckData['author']) ?>
						<?php } else { ?>
						<input type="text" id="author" maxlength="20" value="<?= htmlspecialchars(isset($deckData) ? $deckData['author'] : '') ?>">
						<?php } ?>
					</td>
				</tr>
				<tr>
					<th>パワプロID</th>
					<td>
						<?php if ($mode === 3) { ?>
						<?= htmlspecialchars($deckData['gameId']) ?>
						<?php } else { ?>
						<input type="text" id="gameId" maxlength="20" value="<?= htmlspecialchars(isset($deckData) ? $deckData['gameId'] : '') ?>">
						<?php } ?>
					</td>
				</tr>
				<tr>
					<th>TwitterID</th>
					<td>
						<?php if ($mode === 3) { ?>
						<a href="https://twitter.com/<?= htmlspecialchars(trim($deckData['twitterId'])) ?>"><?= trim($deckData['twitterId']) !== '' ? '@' . htmlspecialchars(trim($deckData['twitterId'])) : '' ?></a>
						<?php } else { ?>
						<input type="text" id="twitterId" maxlength="20" value="<?= htmlspecialchars(isset($deckData) ? $deckData['twitterId'] : '') ?>">
						<?php } ?>
					</td>
				</tr>
			</table>
		</section>

		<!-- ユーザー情報欄 -->
		<section>
			<?php if ($mode === 3) { ?>
			<div>
				<button id="favButton" class="favButton" data-fav-status="0" onclick="deckCreator.setFavarite();">お気に入り</button>
			</div>
			<?php } else { ?>
			<div><button onclick="deckCreator.save();">保存</button></div>
			<?php } ?>
		</section>

	</main>

	<div class="remodal" data-remodal-id="eveCharaRemodal" id="eveCharaRemodal" data-remodal-options="hashTracking:false, closeOnOutsideClick:false, closeOnCancel:false, closeOnConfirm:false">
		<button data-remodal-action="confirm" class="remodal-close"></button>
		<div class="eveCharaListCond">
			<div>
				絞り込み：
				<select id="limitType" onChange="deckCreator.sortEveCharaList()">
					<option value="0">すべて</option>
					<option value="1">打者のみ</option>
					<option value="2">投手のみ</option>
					<option value="3">スタッフのみ</option>
					<option value="4">前イベのみ</option>
					<option value="5">後イベのみ</option>
				</select>
			</div>
			<div>
				並び順：
				<select id="sortOrderType" onChange="deckCreator.sortEveCharaList()">
					<option value="0">登録順</option>
					<option value="1">名前順</option>
					<option value="2">得意練習順</option>
				</select>
				<select id="sortOrderDir" onChange="deckCreator.sortEveCharaList()">
					<option value="0">昇順</option>
					<option value="1">降順</option>
				</select>
			</div>
		</div>
		<hr class="abHr" style="margin:1em 0;">
		<ul id="eveCharaList">
			<?php
			require_once "global.php";
			require_once "./logic/getEveCharaList.php";
			$dbh = DB::connect();
			$list = getEveCharaList($dbh);
			$count = count($list);
			$evTypeList = ['前イベ', '後イベ'];
			$evTypeClass = ['evBefore', 'evAfter'];
			for ($i = 0; $i < $count; $i++) {
				$item = $list[$i];
				$src = $item['trainingType'] !== null ? ' src="../img/practice' . $item['trainingType'] . '.jpg"' : '';
				$selectedClass = isset($deckData) && in_array($item['id'], $deckData['chara']) ? ' selectedItem' : ''; ?>
			<li class="eveCharaListItem" data-chara-id="<?= $item['id'] ?>" data-chara-name="<?= $item['name'] ?>" data-chara-read="<?= $item['yomi'] ?>" data-training-type="<?= $item['trainingType'] ?>" data-chara-type="<?= $item['charaType'] ?>" data-event-type="<?= $item['eventType'] ?>">
				<img class="evecharaIcon<?= $selectedClass ?>" src="../img/eventChara/<?= $item['id'] ?>.jpg"><img class="trainingIcon"<?= $src ?>>
				<div class="nameArea"><?= $item['name'] ?></div>
				<div class="evTypeArea">
					<span class="<?= $evTypeClass[$item['eventType']] ?>"><?= $evTypeList[$item['eventType']] ?></span>
				</div>
			</li>
			<?php } ?>
		</ul>
		<button data-remodal-action="confirm" class="remodal-confirm">OK</button>
	</div>

	<div class="remodal" data-remodal-id="eveCharaRemodal" id="eveCharaRemodal" data-remodal-options="hashTracking:false, closeOnOutsideClick:false, closeOnCancel:false, closeOnConfirm:false">
		<button data-remodal-action="close" class="remodal-close"></button>
	</div>
	<?php include('./optionMenu.php'); ?>

	<?php include('../html/footer.html'); ?>

</body>

</html>