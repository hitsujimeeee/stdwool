/*jslint browser: true, jquery: true */
/*jslint shadow:true*/

$(function(){
    $('.spChara').on('change', entakuLevel.calcStartLevel);
    entakuLevel.calcStartLevel();
});


var entakuLevel = {

    calcStartLevel: function() {
        var typeList = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]];

        $('.charaType').get().forEach(function(elt, idx){
            typeList[parseInt(idx / 2, 10)][idx % 2] = Number($(elt).val());
        });

        var levelList = [2, 1, 2, 1, 1, 1, 1, 1, 2, 1];
        var updownList = [
            [0, 1, -1, 1, 0, 0, 0, 0, -1, 0],
            [0, 0, -1, 1, 0, 0, 0, 0, -1, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, -1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, -1, 0],
            [0, 0, 0, 0, 0, 1, -1, 1, -1, 0],//球速
            [0, 0, 0, 0, 0, 0, -1, 1, -1, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, -1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, -1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//守備
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        var updownStock = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
        var tokuiList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var girlFriend = false;

        for (var i = 0; i < typeList.length; i++) {
            if (typeList[i][0] != 999) {
                //得意練習ごとにループ
                for (var j = 0; j < typeList[i].length; j++) {
                    var charaType = typeList[i][j];
                    if (charaType != -1) {
                        tokuiList[charaType]++;
                        if (j === 0 && tokuiList[charaType] <= 1) {
                            for (var k = 0; k < updownList[charaType].length; k++) {
                                var t = updownList[charaType][k];
                                if (t === 1) {
                                    updownStock[k][1]++;
                                } else if (t === -1){
                                    updownStock[k][0]++;
                                }
                            }
                        }
                    }
                }
            } else {
                girlFriend = true;
            }
        }

        //+が奇数なら練習レベル+1,-が奇数なら練習レベル-1
        for (var i = 0; i < updownStock.length; i++) {
            if (updownStock[i][0] % 2 === 1 && levelList[i] > 1) {
                levelList[i]--;
            } else if (updownStock[i][1] % 2 === 1){
                levelList[i]++;
            }
        }

        //得意練習のレベルを1にする
        for (var i = 0; i < tokuiList.length; i++) {
            if (tokuiList[i] > 0) {
                levelList[i] = 1;
            }
        }

        //彼女あり
        if (girlFriend) {
            //得意練習のレベルを2に、得意練習以外でレベル2のものを3に
            for (var i = 0; i < tokuiList.length; i++) {
                if (tokuiList[i] > 0) {
                    levelList[i] = 2;
                } else if(tokuiList[i] === 0 && levelList[i] === 2){
                    levelList[i] = 3;
                }
            }
        }

        //得意練習が3つ以上重なった場合はレベル1
        for (var i = 0; i < tokuiList.length; i++) {
            if (tokuiList[i] >= 3) {
                levelList[i] = 1;
            }
        }

        //精神のレベルを1に
        levelList[9] = 1;

        //アーサーチェック
        if ($('#checkArthur').prop('checked')) {
            levelList[1]++;
            levelList[6]++;
        }

        //モルドレッドチェック
        if ($('#checkMordred').prop('checked')) {
            levelList[0]++;
        }

        //クネミアチェック
        if ($('#checkKunemia').prop('checked')) {
            levelList[2]++;
            levelList[5]++;
        }

        entakuLevel.output(levelList);

    },

    output: function(list) {
        for (var i = 0; i < list.length; i++) {
            $('.dispLevel').eq(i).html(list[i]);
            if(list[i] >= 3) {
                $('.dispLevel').eq(i).parent('p').addClass('redColor');
            } else {
                $('.dispLevel').eq(i).parent('p').removeClass('redColor');
            }
        }
    },

};

