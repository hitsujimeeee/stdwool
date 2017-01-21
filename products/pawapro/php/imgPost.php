<?php

//2桁毎に64進数→3桁16進数に変換
function convertx64Tox16($str) {
	$x16Array = '0123456789abcdef';
	$x64Array = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/';
	$result = '';

	for($i = 0; $i < strlen($str) / 2; $i++) {
		$partStr = substr($str, $i * 2, 2);
		$num = 0;
		for ($j = 0; $j < strlen($partStr); $j++) {
			$num += strpos($x64Array, $partStr[$j]) * pow(64, strlen($partStr)-1-$j);
		}
		$result .= $x16Array[(int)($num/(16*16))] . $x16Array[(int)($num%(16*16)/16)] . $x16Array[(int)($num)%16];
	}
	return $result;
}
if(isset($_GET['charaId'])) {
	$charaId = convertx64Tox16($_GET['charaId']);
} else {
	$charaId = null;
}
?>
<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="UTF-8">
		<meta name="author" content="">
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title></title>
		<link rel="stylesheet" href="./css/jquery-ui.min.css">
		<link rel="stylesheet" href="./css/remodal.css">
		<link rel="stylesheet" href="./css/remodal-default-theme.css">
		<script src="./js/plugin/jquery-3.1.1.min.js"></script>
		<script src="./js/plugin/jquery-ui.min.js"></script>
		<script src="./js/plugin/remodal.min.js"></script>
		<script type="text/javascript">
			$(function() {
				$('#sendFile').on('change', function () {
					upload();
				});
			});

			function upload() {
				var param = getURLParameter();
				var fd = new FormData($('#sendForm').get(0));
				fd.append('charaId', param.charaId);
				$.ajax({
					url: "./recieveImage.php",
					type: "POST",
					data: fd,
					processData: false,
					contentType: false,
					dataType: 'json'
				})
					.done(function( data ) {
					$('#charaImg').attr('src', './img/' + data.charaId + '.jpg' + '?' + new Date().getTime());
				})
					.fail(function( res ) {
					alert(res.responseText);
				});
				return false;
			};

			function getURLParameter() {
				var arg = new Object;
				var pair=location.search.substring(1).split('&');
				for(var i=0;pair[i];i++) {
					var kv = pair[i].split('=');
					arg[kv[0]]=kv[1];
				}
				return arg;
			}

		</script>
		<style>

			.charaImg {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				margin: auto;
				max-width: 96px;
				max-height: 96px;
			}

			.imgBorder {
				width: 96px;
				height: 96px;
				border: solid 1px #aaa;
				position: relative;;
			}

			.upLabel {
				cursor: pointer;
			}

		</style>

	</head>

	<body>

		<header>


		</header>

		<main>
			<label for="sendFile" class="upLabel">
				<div class="imgBorder">
					<img id="charaImg" src="<?php
											$url = './img/' . $charaId . '.jpg';
											if(!$charaId && file_exists($url)) {
												echo $url;
											} else {
												echo './img/test.jpg';
											}
											?>" class="charaImg"><br clear="all">
				</div>
				<form id="sendForm" style="display:none;">
					<input type="file" id="sendFile" name="sendFile" style="display:none;">
				</form>
			</label>

		</main>

		<footer>

		</footer>

	</body>

</html>
