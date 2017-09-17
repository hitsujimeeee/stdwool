<!DOCTYPE html>
<html lang="ja">

<head>
	<?php
	$title = 'パワプロアプリ | 投手シミュレーター';
	$description = 'パワプロアプリの育成シミュレーター(投手版)です。目標能力までに必要な経験点を計算できます。査定計算機能や、余った経験点から査定が最大になるように能力を振ってくれる査定最大化機能もあります。';
	require_once './headInclude.php';
	?>
	<link rel="stylesheet" href="../css/batter.css?ver20170917">
	<link rel="stylesheet" href="../css/pitcher.css?ver20170917">
	<script src="../js/pitcher.js?ver20170917"></script>
	<script src="../js/calcMaxAssessmentPitcher.js?ver20170912"></script>
	<script src="../js/commonModule.js?ver20170917"></script>
	<script>var abilityCount = <?php include('../php/getAbilityCount.php'); ?>;</script>
</head>

<body>
	<?php include('../php/header.php'); ?>

	<main>
		<header class="pageHeader">
			<h2><img class="iconGraph" src="../img/icon/ball.png">投手シミュレーター</h2>
		</header>
		<div id="ui-tab">
			<ul class="tab_menu">
				<li><a class="tabMenu" href="#tab1">現在値</a></li>
				<li><a class="tabMenu" href="#tab2">目標値</a></li>
				<li><a class="tabMenu" href="#tab3">確認画面</a></li>
			</ul>
			<div id="tab1" class="tab_content">

				<section class="basePointSection">
					<p>■基礎能力<button class="exec" onclick="ga('send', 'event', 'action', 'click', 'pitcher/setRandomDefault');IndividModule.setRandomDefault();">ランダム</button></p>
					<table class="basePoint modern">
						<tr>
							<th>球速</th>
							<th>コン</th>
							<th>スタ</th>
						</tr>
						<tr class="baseRank">
							<td>
								<div class="alphaScreen"></div>
								<div class="valueScreen"></div>
							</td>
							<td><div></div></td>
							<td><div></div></td>
						</tr>
						<tr>
							<td><input type="number" class="basePointInput" min="80" max="170" step="1"></td>
							<td><input type="number" class="basePointInput" min="1" max="102" step="1"></td>
							<td><input type="number" class="basePointInput" min="1" max="100" step="1"></td>
						</tr>
					</table>
				</section>

				<section class="changeBallSection">
					<p>■変化球</p>
					<div class="table-responsive">
						<table class="changeBall modern">
							<tr>
								<?php
								require_once "makeChangeBallList.php";
								$data = makeChangeBallList();
								echo $data;
								?>
							</tr>
							<tr class="changeBallRank">
								<td><div><span></span></div></td>
								<td><div><span></span></div></td>
								<td><div><span></span></div></td>
								<td><div><span></span></div></td>
								<td><div><span></span></div></td>
								<td><div><span></span></div></td>
							</tr>
							<tr>
								<td><?php makeValueSelectBox(null, 'changeBallInput', 1) ?></td>
								<td><?php makeValueSelectBox(null, 'changeBallInput', 7) ?></td>
								<td><?php makeValueSelectBox(null, 'changeBallInput', 7) ?></td>
								<td><?php makeValueSelectBox(null, 'changeBallInput', 7) ?></td>
								<td><?php makeValueSelectBox(null, 'changeBallInput', 7) ?></td>
								<td><?php makeValueSelectBox(null, 'changeBallInput', 7) ?></td>
							</tr>
						</table>
					</div>
				</section>

				<section class="abilitySection">
					<p>■特殊能力<button onclick="commonModule.openModalWindow(0);" class="addAbility"><i class="fa fa-sign-in"></i>追加</button><span class="abilityCount">0個</span></p>
					<div class="displayAbility"></div>
				</section>

				<section class="abilitySection">
					<p>■サブポジ</p>
					<div class="displaySubPosition">
						<ul class="subPositionList">
							<?php
							require_once "getSubPositionList.php";
							getSubPositionList(1, 0);
							?>
						</ul>
					</div>
				</section>
			</div>



			<div id="tab2" class="tab_content">
				<section class="basePointSection">
					<p>■基礎能力</p>
					<table class="basePoint modern">
						<tr>
							<th>球速</th>
							<th>コン</th>
							<th>スタ</th>
						</tr>
						<tr class="baseRank">
							<td>
								<div class="alphaScreen"></div>
								<div class="valueScreen"></div>
							</td>
							<td><div></div></td>
							<td><div></div></td>
						</tr>
						<tr>
							<td><input type="number" class="basePointInput" min="80" max="170" step="1"></td>
							<td><input type="number" class="basePointInput" min="1" max="102" step="1"></td>
							<td><input type="number" class="basePointInput" min="1" max="100" step="1"></td>
						</tr>
					</table>
				</section>

				<section class="changeBallSection">
					<p>■変化球</p>
					<div class="table-responsive">
						<table class="changeBall modern">
							<tr>
								<?php
								$data = makeChangeBallList();
								echo $data;
								?>
							</tr>
							<tr class="changeBallRank">
								<td><div><span></span></div></td>
								<td><div><span></span></div></td>
								<td><div><span></span></div></td>
								<td><div><span></span></div></td>
								<td><div><span></span></div></td>
								<td><div><span></span></div></td>
							</tr>
							<tr>
								<td><?php makeValueSelectBox(null, 'changeBallInput', 1) ?></td>
								<td><?php makeValueSelectBox(null, 'changeBallInput', 7) ?></td>
								<td><?php makeValueSelectBox(null, 'changeBallInput', 7) ?></td>
								<td><?php makeValueSelectBox(null, 'changeBallInput', 7) ?></td>
								<td><?php makeValueSelectBox(null, 'changeBallInput', 7) ?></td>
								<td><?php makeValueSelectBox(null, 'changeBallInput', 7) ?></td>
							</tr>
						</table>
					</div>
				</section>

				<section class="abilitySection">
					<p>■特殊能力<button onclick="commonModule.openModalWindow(1);" class="addAbility"><i class="fa fa-sign-in"></i>追加</button><span class="abilityCount">0個</span></p>
					<div class="displayAbility"></div>
				</section>

				<section class="abilitySection">
					<p>■サブポジ</p>
					<div class="displaySubPosition">
						<ul class="subPositionList">
							<?php
							getSubPositionList(1, 1);
							?>
						</ul>
					</div>
				</section>


			</div>


			<div id="tab3" class="tab_content">
				<section id="charaBaseData">
					<p>■選手情報</p>
					<input type="hidden" id="characterId" value="">
					<div>名前<input type="text" id="charaName"></div>
					<div>
						ポジション
						<select id="mainPosition">
							<option value="0">先発</option>
							<option value="1">中継ぎ</option>
							<option value="2">抑え</option>
						</select>
					</div>
					<div>
						利き腕
						<select id="useHand">
							<option value="0">右投右打</option>
							<option value="1">右投左打</option>
							<option value="2">右投両打</option>
							<option value="3">左投右打</option>
							<option value="4">左投左打</option>
							<option value="5">左投両打</option>
						</select>
					</div>
				</section>

				<section>
					<p>■基礎コツ</p>
					<table class="baseTrickTable">
						<tr>
							<td class="baseTrickTitle">球速</td>
							<td class="baseTrickBar">
								<div class="slider baseTrickSlider"></div>
							</td>
						</tr>
						<tr>
							<td class="baseTrickTitle">コン</td>
							<td class="baseTrickBar">
								<div class="slider baseTrickSlider"></div>
							</td>
						</tr>
						<tr>
							<td class="baseTrickTitle">スタ</td>
							<td class="baseTrickBar">
								<div class="slider baseTrickSlider"></div>
							</td>
						</tr>
					</table>

				</section>

				<section>
					<p>■変化球コツ</p>
					<table class="changeBallTrickTable">
						<tr>
							<td class="changeBallTrickTitle">第２ｽﾄﾚｰﾄ</td>
							<td class="changeBallTrickBar">
								<div class="slider changeBallTrickSlider"></div>
							</td>
						</tr>
						<tr>
							<td class="changeBallTrickTitle">スライダー</td>
							<td class="changeBallTrickBar">
								<div class="slider changeBallTrickSlider"></div>
							</td>
						</tr>
						<tr>
							<td class="changeBallTrickTitle">カーブ</td>
							<td class="changeBallTrickBar">
								<div class="slider changeBallTrickSlider"></div>
							</td>
						</tr>
						<tr>
							<td class="changeBallTrickTitle">フォーク</td>
							<td class="changeBallTrickBar">
								<div class="slider changeBallTrickSlider"></div>
							</td>
						</tr>
						<tr>
							<td class="changeBallTrickTitle">シンカー</td>
							<td class="changeBallTrickBar">
								<div class="slider changeBallTrickSlider"></div>
							</td>
						</tr>
						<tr>
							<td class="changeBallTrickTitle">シュート</td>
							<td class="changeBallTrickBar">
								<div class="slider changeBallTrickSlider"></div>
							</td>
						</tr>
					</table>

				</section>

				<section class="baseLimitBreakArea">
					<p>■基礎上限突破</p>
					<div>
						球速
						<select class="baseLimitBreak">
							<option value="170">170</option>
						</select>
					</div>
					<div>
						コン
						<select class="baseLimitBreak">
							<option value="100">100</option>
							<option value="102">102</option>
						</select>
					</div>
					<div>
						スタ
						<select class="baseLimitBreak">
							<option value="100">100</option>
						</select>
					</div>
				</section>


				<section>
					<p>■センス</p>
					<div>
						<ul class="senseButtonList">
							<li><label class="senseM"><input type="radio" name="senseGroup" value="1"><span>センス○</span></label></li>
							<li><label class="senseB"><input type="radio" name="senseGroup" value="-1"><span>センス×</span></label></li>
						</ul>
					</div>
				</section>
				<section>
					<p>■必要経験点<button class="exec calcExp" onclick="ga('send', 'event', 'action', 'click', 'pitcher/calcExpPoint');commonModule.calcExpPoint();">経験点算出</button></p>
					<table class="needExp modern">
						<tr>
							<th>筋力</th>
							<th>敏捷</th>
							<th>技術</th>
							<th>変化球</th>
							<th>精神</th>
							<th>合計</th>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>

					</table>
					<p class="optionChkArea"><input type="checkbox" id="nonAssessment">査定値を表示しない</p>
				</section>


				<section id="charaDataDisplay">
					<p>■選手データ-------</p>
					<div>
						<label id="faceLabel" for="sendFile" class="upLabel">
							<div class="imgBorder">
								<img id="charaImg" src="../img/noface.jpg" class="charaFace"><br clear="all">
							</div>
							<form id="sendForm" style="display:none;">
								<input type="file" id="sendFile" name="sendFile" accept="image/*" style="display:none;">
							</form>
						</label>
						<p>【登録名】<span id="entryNameCharaData"></span></p>
						<p>【ポジション】<span id="mainPositionCharaData"></span></p>
						<p>【サブポジ】<span id="subPositionCharaData"></span></p>
						<p>【投打】<span id="useHandCharaData"></span></p>
						<p>【基礎能力】<span id="baseAbilityCharaData"></span></p>
						<p>【変化球】<span id="changeBallCharaData"></span></p>
						<p>【特殊能力】</p>
						<div><ul id="abilityCharaData"></ul></div>
						<p>【査定】<span id="assessmentPointCharaData"></span></p>
					</div>

					<p>---------------------</p>
				</section>

				<section>
					<p>■査定最大化<button class="exec calcMax" onclick="ga('send', 'event', 'action', 'click', 'pitcher/calcMaxAssessment');calcMaxAssessmentPitcherModule.calcMaxAssessmentPitcher();">実行</button></p>
					<table class="maxAssessment modern">
						<tr>
							<th>筋力</th>
							<th>敏捷</th>
							<th>技術</th>
							<th>変化球</th>
							<th>精神</th>
							<th>合計</th>
						</tr>
						<tr>
							<td><input type="number" class="pointInput" min="0" max="999"></td>
							<td><input type="number" class="pointInput" min="0" max="999"></td>
							<td><input type="number" class="pointInput" min="0" max="999"></td>
							<td><input type="number" class="pointInput" min="0" max="999"></td>
							<td><input type="number" class="pointInput" min="0" max="999"></td>
							<td class="ownPointTotal"></td>
						</tr>
					</table>
					<p class="optionChkArea">
						<input type="checkbox" id="nonStamina">スタミナを上げない<br>
						<input type="checkbox" id="abilityOnly">特殊能力のみ最大化
					</p>
					<p><a href="./manual.php#idx1-9" target="_blank" style="color:#00f;border-bottom: solid 1px blue">※査定最大化の注意事項</a></p>
				</section>

				<section>
					<p>■選手データ保存</p>
					<p><button class="exec save"onclick="commonModule.saveCharaData(1)">保存</button></p>
					<div class="shareLinkHeader">▼共有用URL</div>
					<div class="shareLinkBody"></div>
				</section>
			</div>


		</div>



		<div id="abilityModal" class="remodal" data-remodal-id="modal" data-remodal-options="hashTracking:false, closeOnOutsideClick:false, closeOnCancel:false, closeOnConfirm:false, closeOnEscape:false">
			<button class="remodal-close" onclick="commonModule.CancelRemodal()"></button>
			<div id="abilityList">
				<!-- <h2>特殊能力選択</h2> -->
				<div id="abSelectList" class="container-fluid">

					<div style="text-align:left;"><img class="iconGraph" src="../img/icon/ball.png">投手特能</div>
					<hr class="abHr">
					<ul class="block-grid block-grid-1-2-3 abilityButtonList">

						<?php
						require_once "getAbilityList.php";
						$data = getAbilityList(1);
						$displayIdx = 0;

						for ($i = 0; $i < count($data); $i++) {
							$d = $data[$i];
							if ($d['category'] === '4') {
								echo '<li idx="' . $d['id'] . '"><a name="ability" default="' . $d['name'] . '" headerId="' . $d['id'] . '" href="javascript:commonModule.openAbilityDetail(' . $displayIdx . ', ' . $d['id'] . ');">' . $d['name'] . '</a></li>';
								$displayIdx++;
							}
						}

						?>
					</ul>

					<div style="text-align:left;"><i class="fa fa-times iconGraph" aria-hidden="true"></i>マイナス特能</div>
					<hr class="abHr">

					<ul class="block-grid block-grid-1-2-3 abilityButtonList">

						<?php
						for ($i = 0; $i < count($data); $i++) {
							$d = $data[$i];
							if ($d['category'] === '8') {
								echo '<li idx="' . $d['id'] . '"><a name="ability" default="' . $d['name'] . '" headerId="' . $d['id'] . '" href="javascript:commonModule.openAbilityDetail(' . $displayIdx . ', ' . $d['id'] . ');">' . $d['name'] . '</a></li>';
								$displayIdx++;
							}
						}

						?>
					</ul>

					<div style="text-align:left;"><i class="fa fa-user iconGraph" aria-hidden="true"></i>その他特能</div>
					<hr class="abHr">

					<ul class="block-grid block-grid-1-2-3 abilityButtonList">

						<?php
						for ($i = 0; $i < count($data); $i++) {
							$d = $data[$i];
							if ($d['category'] === '6' || $d['category'] === '7') {
								echo '<li idx="' . $d['id'] . '"><a name="ability" default="' . $d['name'] . '" headerId="' . $d['id'] . '" href="javascript:commonModule.openAbilityDetail(' . $displayIdx . ', ' . $d['id'] . ');">' . $d['name'] . '</a></li>';
								$displayIdx++;
							}
						}

						?>
					</ul>

				</div>
			</div>


			<div id="abilityDetail" class="hiddenDisplay">
				<div id="detailContent">
					<ul id="abilityDetailList" class="block-grid block-grid-1-2-3 abilityDetailList abilityButtonList"></ul>
				</div>
				<div class="abilityPointTableDiv">
					<table class="modern abilityPointTable">
						<tr>
							<th>筋力</th>
							<th>敏捷</th>
							<th>技術</th>
							<th>変化</th>
							<th>精神</th>
							<th>合計</th>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					</table>
				</div>
				<div class="boxContainer TrickDiv" id="abilityTrickSliderDiv">
					<div class="box trickTitle">特能コツLv</div>
					<div class="box trickBar">
						<div id="abilitySlider" class="slider abilitySlider"></div>
					</div>
				</div>
				<div class="boxContainer TrickDiv" id="abilityStrickSliderDiv">
					<div class="box trickTitle">金特コツLv</div>
					<div class="box trickBar">
						<div id="SabilitySlider" class="slider SabilitySlider"></div>
					</div>
				</div>
			</div>
			<div class="modalButton">
				<button data-remodal-action="confirm" class="remodal-confirm">OK</button>
				<button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>
			</div>
		</div>

		<!--サブポジ用モーダルウインドウ-->
		<div id="subPositionModal" class="remodal" data-remodal-id="subPositionModal" data-remodal-options="hashTracking:false, closeOnOutsideClick:false, closeOnCancel:false, closeOnConfirm:false, closeOnEscape:false">
			<button data-remodal-action="close" class="remodal-close"></button>
			<div class="">
				<ul id="subPositionDetailList" class="block-grid block-grid-1-2-3 subPositionDetailList">
				</ul>
			</div>
			<div class="modalButton">
				<button data-remodal-action="confirm" class="remodal-confirm">OK</button>
				<button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>
			</div>
		</div>
	</main>

	<?php include('./optionMenu.php'); ?>

	<?php include('../html/footer.html'); ?>
</body>

</html>
<?php
function makeValueSelectBox($id, $class, $n) {
	$str = '<select' . ($id ? ' id="' . $id . '"' : '') . ($class ? ' class="' . $class . '"' : '') . '>';
	for ($i = 0; $i <= $n; $i++) {
		$str .= '<option value="' . ($i) . '">' . ($i) . '</option>';
	}
	$str .= '</select>';
	echo $str;
}
?>
