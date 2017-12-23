<!DOCTYPE html>
<html lang="ja">

<head>
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@hitsujiPawapro" />
    <meta name="og:url" content="http://studiowool.webcrow.jp/products/pawapro/php/entakuLevel.php" />
    <meta name="og:title" content="パワプロアプリ育成シミュレーター 円卓高校練習レベル計算機" />
    <meta name="og:description" content="パワプロアプリ円卓高校の初期練習レベルを計算するツールです。" />
    <meta name="og:image" content="http://studiowool.webcrow.jp/products/pawapro/img/thumbnail.jpg" />
    <?php
    $title = 'パワプロアプリ　円卓高校練習レベル計算機';
    $description = 'パワプロアプリ円卓高校の初期練習レベルを計算するツールです。';
    require_once './headInclude.php';
    ?>
    <link rel="stylesheet" href="../css/entakuLevel.css">
    <script src="../js/entakuLevel.js?ver20171220"></script>
</head>

<body>
    <?php include('../php/header.php'); ?>

    <main>
        <header class="pageHeader">
            <h2><i class="fa fa-trophy" aria-hidden="true"></i>円卓高校練習レベル計算機</h2>
        </header>
        <section>
            <header class="secHeader">■得意練習</header>

            <div class="secMain">
                <table class="modern eveCharaTable">
                    <tr>
                        <th></th>
                        <th>メイン練習</th>
                        <th>サブ練習</th>
                    </tr>
                    <tr>
                        <th>1</th>
                        <td><?= makeCharaTypeList(); ?></td>
                        <td><?= makeCharaTypeList(); ?></td>
                    </tr>
                    <tr>
                        <th>2</th>
                        <td><?= makeCharaTypeList(); ?></td>
                        <td><?= makeCharaTypeList(); ?></td>
                    </tr>
                    <tr>
                        <th>3</th>
                        <td><?= makeCharaTypeList(); ?></td>
                        <td><?= makeCharaTypeList(); ?></td>
                    </tr>
                    <tr>
                        <th>4</th>
                        <td><?= makeCharaTypeList(); ?></td>
                        <td><?= makeCharaTypeList(); ?></td>
                    </tr>
                    <tr>
                        <th>5</th>
                        <td><?= makeCharaTypeList(); ?></td>
                        <td><?= makeCharaTypeList(); ?></td>
                    </tr>
                    <tr>
                        <th>6</th>
                        <td><?= makeCharaTypeList(); ?></td>
                        <td><?= makeCharaTypeList(); ?></td>
                    </tr>
                </table>
            </div>

        </section>

        <section>
            <header class="secHeader">■高校固有キャラ</header>
            <div class="secMain">
                <div><input type="checkbox" id="checkArthur" class="spChara">阿麻</div>
                <div><input type="checkbox" id="checkMordred" class="spChara">望戸</div>
                <div><input type="checkbox" id="checkKunemia" class="spChara">久根</div>
                <div>※高校固有キャラによる練習Lvアップは、エンタクルス解放時</div>
            </div>
        </section>

        <section>
            <header class="secHeader">■練習レベル</header>
            <div class="secMain">
                <p>打撃：Lv<span class="dispLevel"></span></p>
                <p>筋力：Lv<span class="dispLevel"></span></p>
                <p>走塁：Lv<span class="dispLevel"></span></p>
                <p>肩力：Lv<span class="dispLevel"></span></p>
                <p class="noneDisp">球速：Lv<span class="dispLevel"></span></p>
                <p class="noneDisp">ｺﾝﾄﾛｰﾙ：Lv<span class="dispLevel"></span></p>
                <p class="noneDisp">ｽﾀﾐﾅ：Lv<span class="dispLevel"></span></p>
                <p class="noneDisp">変化球：Lv<span class="dispLevel"></span></p>
                <p>守備：Lv<span class="dispLevel"></span></p>
                <p>精神：Lv<span class="dispLevel"></span></p>
            </div>
        </section>
    </main>


    <?php include('./optionMenu.php'); ?>

    <?php include('../html/footer.html'); ?>
</body>

</html>


<?php
    function makeCharaTypeList() {
        return '
            <select class="charaType" onchange="entakuLevel.calcStartLevel();">
                <option value="-1"></option>
                <option value="0">打撃</option>
                <option value="1">筋力</option>
                <option value="2">走塁</option>
                <option value="3">肩力</option>
                <option value="4">球速</option>
                <option value="5">ｺﾝﾄﾛｰﾙ</option>
                <option value="6">ｽﾀﾐﾅ</option>
                <option value="7">変化球</option>
                <option value="8">守備</option>
                <option value="9">精神</option>
                <option value="999">彼女</option>
        ';
    }
?>
