<html>
	<head><title>PHP TEST</title></head>
	<body>

		<?php

			$link = mysql_connect('localhost', 'testuser', 'testuser');
			if (!$link) {
				die('接続失敗です。'.mysql_error());
			}

			print('<p>接続に成功しました。</p>');

			// MySQLに対する処理

			$close_flag = mysql_close($link);

			if ($close_flag){
				print('<p>切断に成功しました。</p>');
			}

		?>
	</body>
</html>
