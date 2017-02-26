<!DOCTYPE html>
<html lang="ja">
<head>
	<?php
	$title = 'パワプロアプリ育成シミュレーター | 使い方';
	$description = 'パワプロアプリの育成シミュレーターです。目標選手の育成に必要な経験点を計算してくれます。';
	require_once './headInclude.php';
	?>
	<link rel="stylesheet" href="../css/manual.css">
</head>
<body>
	<?php include('./header.php'); ?>

	<main>
		<header class="pageHeader">
			<h2 id="title"><i class="fa fa-home"></i>パワプロアプリ育成シミュレーター 使い方</h2>
		</header>

		<section>
			<h3>■育成シミュレーターの使い方</h3>

			<section>
				<div>
					<img src="../img/manual/001.jpg">
				</div>
				<h3 class="sectionHeader"><i class="fa fa-pencil"></i>各タブの役割</h3>
				<dl class="descDefList">
					<dt>①現在値</dt>
					<dd>選手の現在のステータスを入力する部分です。</dd>
					<dt>②目標値</dt>
					<dd>目標とするステータスを入力する部分です。</dd>
					<dt>③確認画面</dt>
					<dd>選手名やポジション、基礎コツ、センス有無などの情報を入力する部分です。<br>計算した経験点はこのタブに表示されます。</dd>
				</dl>
			</section>

			<section>
				<h3 class="sectionHeader"><i class="fa fa-mouse-pointer"></i>各能力の入力方法</h3>
				<dl class="descDefList">
					<dt>・基礎能力</dt>
					<dd>
						キーボードから入力します<br>
						<div>野手：弾道、ミート、パワー、走力、肩力、守備、捕球</div>
						<div>投手：球速、コントロール、スタミナ</div>
					</dd>
					<dt>・変化球(投手のみ)</dt>
					<dd>
						球種、変化量をリストから選択します。
					</dd>
					<dt>・特殊能力</dt>
					<dd>
						「追加」ボタンを押すと、特殊能力リストが表示されます。
					</dd>
					<dt>・サブポジ</dt>
					<dd>
						取得したいサブポジをクリックすると、選択ウインドウが表示されます。
					</dd>
				</dl>
			</section>

			<section>
				<h3 class="sectionHeader"><i class="fa fa-hand-pointer-o"></i>特殊能力の選択方法</h3>
				<div><img src="../img/manual/002.jpg"></div>
				<p>現在値タブ、目標値タブで特殊能力の「追加」ボタンを押すと、特殊能力リストが表示されます。</p>
				<div><img src="../img/manual/003.jpg"></div>
				<p>特殊能力リスト上で習得したい特殊能力をクリックすると、特能選択ウインドウが表示されます。</p>
				<div><img src="../img/manual/004.jpg"></div>
				<p>特殊能力、コツを設定してOKボタンを押します。</p>
				<div><img src="../img/manual/005.jpg"></div>
				<p>特殊能力リストに選択した内容が反映されます。</p>
				<div><img src="../img/manual/006.jpg"></div>
				<p>
					特殊能力リスト左上の×ボタン、もしくは下部のOKボタンをクリックすると、特殊能力リスト画面を閉じます。<br>
					選択した特殊能力の一覧が特殊能力欄に、表示されます。
				</p>
			</section>

			<section>
				<h3 class="sectionHeader"><i class="fa fa-calculator"></i>経験点の算出方法</h3>
				<div><img src="../img/manual/007.jpg"></div>
				<div><img src="../img/manual/008.jpg"></div>
				<p>現在値と目標値を設定したら、確認画面タブに移動します。</p>
				<div><img src="../img/manual/009.jpg"></div>
				<p>経験点算出ボタンをクリックします。</p>
				<div><img src="../img/manual/010.jpg"></div>
				<p>現在値から目標値に達するまでに必要な経験点が表示されます。</p>
			</section>

			<section>
				<h3 class="sectionHeader"><img class="iconGraph" src="../img/icon/muscle.png">査定最大化機能</h3>
				<div><img src="../img/manual/011.jpg"></div>
				<p>現在値タブで現在の能力、各習得済みコツを設定します。</p>
				<div><img src="../img/manual/012.jpg"></div>
				<p>確認画面タブの査定最大化欄に所持経験点を入力し、「実行」ボタンをクリックします。</p>
				<div><img src="../img/manual/013.jpg"></div>
				<p>
					査定最大化処理が行われ、目標値タブに査定を最大化した場合のステータスが表示されます。<br>
					※入力内容によっては、処理に時間がかかる場合があります。
				</p>
			</section>
			<section id="saveSection">
				<h3 class="sectionHeader"><i class="fa fa-floppy-o"></i>保存機能</h3>
				<h4>●入力した選手情報を保存する</h4>
				<p>
					画面右下の「<i class="fa fa-gear"></i>設定」ボタンをクリックし、設定ウインドウを開きます。<br>
				</p>
				<div><img src="../img/manual/06-01.jpg"></div>
				<p>
					ユーザー名、パスワードを入力し「OK」ボタンをクリックします。<br>
					<span style="color:#ff0000;">※ユーザー登録の必要はありません。ユーザー名とパスワードの組み合わせに紐づけて選手データが保存されます。<br>　他の人と被る事が無いようなる複雑なパスワードを設定してください。</span><br>
					ユーザー名、パスワードはともに半角英数字で8～20文字にしてください。<br>
				</p>
				<div><img src="../img/manual/06-02.jpg"></div>
				<p>
					確認画面タブ最下部の「保存」ボタンをクリックします。
				</p>
				<div><img src="../img/manual/06-03.jpg"></div>
				<p>作成した選手のデータが保存されます。</p>
				<div><img src="../img/manual/06-04.jpg"></div>
				<h4>●保存した選手情報を表示する</h4>
				<p>トップ画面で「作成選手一覧」リンクをクリックします。</p>
				<div><img src="../img/manual/06-05.jpg"></div>
				<div><img src="../img/manual/06-06.jpg"></div>
				<p>
					「<i class="fa fa-gear"></i>設定」ウインドウに入力済みのユーザー名、パスワードで登録した選手情報の一覧で表示されます。<br>
					編集ボタンを押すと選手情報の編集画面へと遷移します。
				</p>
			</section>

			<section>
				<h3 class="sectionHeader"><i class="fa fa-link"></i>選手画像のアップロード</h3>
				<p>
					登録した選手にお好みの画像を設定できます。<br><br>
					「確認画面」タブ内の選手情報にある画像の部分をクリックします。
				</p>
				<div><img src="../img/manual/07-01.jpg"></div>
				<p>
					PC(スマフォ)内の画像を選択します
				</p>
				<div><img src="../img/manual/07-02.jpg"></div>
				<p>
					選択した画像が選手の画像として使用されます。<br>
					「保存」ボタンを押すと登録が完了し、次回以降も選択した画像で表示されます。
				</p>
				<div><img src="../img/manual/07-03.jpg"></div>
			</section>

			<section>
				<h3 class="sectionHeader"><i class="fa fa-link"></i>選手情報の共有</h3>
				<div><img src="../img/manual/018.jpg"></div>
				<p>
					作成選手一覧画面から選手情報の編集を押して表示される画面のURLを使用することで、他のユーザーに選手情報を共有できます。<br>
					他のユーザーが共有URLから選手情報を参照し、選手情報を変更した場合でも、共有元の選手情報が更新されることはありません。<br>
					共有されたユーザーの新しい選手情報として新規作成されます。
				</p>
			</section>
		</section>



	</main>
	<?php include('../html/footer.html'); ?>
</body>

</html>
