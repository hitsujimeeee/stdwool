/*jslint browser: true, jquery: true, shadow:true */
/* global MersenneTwister */


$(function(){
	$('.sRate').eq(0).val(1);
	$('.sRate').eq(1).val(6);
	$('.sRate').eq(2).val(20.95);
	$('.sRate').eq(3).val(72.05);
	$('#allCount').val(97);
	$('#pCount').val(2);
	$('#pRate').val(25);
});


var moneyCalc = {

	calc: function() {

		//入力値取得
		var target = Number($('#targetRarelity').val()),
			ownStatus = Number($('#ownStatus').val()),
			sRates = $('.sRate').map(function(idx, elm){
				return Number($(elm).val())/100;
			}),
			allCount = Number($('#allCount').val()),
			pCount = Number($('#pCount').val()),
			pRate = Number($('#pRate').val())/100,
			confCount = Number($('#confCount').val()) || 0,
			confRarelity = Number($('#confRarelity').val()) || 0,
			confType = Number($('input[name=confType]:checked').val()),
			mixFlag = $('#mixFlag').prop('checked'),
			simFlag = $('#simFlag').prop('checked'),
			psrseed = $('#psrseed').prop('checked');


		var perList = [
			[1, 0.3, 0.05, 0.005],
			[1, 1, 0.3, 0]
		];
		var SIMU_MAX_COUNT = simFlag ? 10000 : 1;
		var simuCount = SIMU_MAX_COUNT;
		var totalTryCount = 0;
		var maxCount = 0;
		var minCount = Number.MAX_SAFE_INTEGER;
		var totalCards = [0, 0, 0, 0];
		var botaiGetCount = 0;
		var mt = new MersenneTwister();
		var chraGetRate = pCount === 0 ? 1 / allCount : pRate/pCount;

		ownStatus = (ownStatus === 0 ? null : ownStatus - 1);

		while(simuCount > 0) {
			var tryCount = 0;
			var cards = [0, 0, 0, 0];
			var limitOpen = ownStatus;
			var srG = null;
			var prtoSR = 0;
			var prG = null;
			botaiGetCount = 0;
			totalCards = [0, 0, 0, 0];


			while(true) {


				//ガチャを10連分引く
				for (var i = 0; i < 10; i++) {
					var p = mt.next();
					var totalp = 0;
					for (var j = 0; j < sRates.length; j++) {

						//レアリティ判定
						if (p < totalp + sRates[j]) {
							var rarelity = j;
							if (i < confCount && confRarelity + 1 < j) {
								rarelity = confRarelity + 1;
							}
							var pn = mt.next();

							//対象キャラが当たるか
							if (i < confCount && confType === 1) {
								// 1/ピックアップキャラ数の確率
								if(pn < 1 / pCount) {
									cards[rarelity]++;
									totalCards[rarelity]++;
								}
							} else {
								// pickup率/ピックアップキャラ数の確率
								if(pn < chraGetRate) {
									cards[rarelity]++;
									totalCards[rarelity]++;
								}
							}

							break;
						}
						totalp += sRates[j];
					}
				}


				tryCount += 10;

				//初母体確保時に処理
				if (limitOpen === null && cards[target] > 0)  {
					cards[target]--;
					limitOpen = 0;
					botaiGetCount = tryCount;
				}

				if (limitOpen !== null) {

					//素材合成
					if (mixFlag) {
						switch(target) {
							case 0:
								//PSR50狙いの場合
								while(cards[3] > 0) {

									//PRの合成用が無ければ確保
									if (prG === null) {
										if(cards[2] > 0) {
											cards[2]--;
											prG = 0;
										} else {
											//PR持ってなければ終了
											break;
										}
									}


									var lp = mt.next();
									if (lp < 0.3) {
										prG++;
									}
									cards[3]--;
									if (prG >= 5) {
										prtoSR++;
										prG = null;
									}
								}

								//PR+5をSRの合成用に混ぜる
								while(prtoSR > 0 && (srG !== null || cards[1] > 0)) {
									//SRの合成用が無ければ確保
									if (srG === null) {
										if(cards[1] > 0) {
											cards[1]--;
											srG = 0;
										}
									}
									var lp = mt.next();
									if (lp < 0.3) {
										srG += 2;
									} else {
										srG++;
									}
									if (srG >= 5) {
										lp = mt.next();
										if (lp < 0.3) {
											limitOpen += 2;
										} else {
											limitOpen++;
										}
										srG = null;
									}

									prtoSR--;
								}


								while(cards[2] > 1) {

									//SRの合成用が無ければ確保
									if (srG === null) {
										if(cards[1] > 0) {
											cards[1]--;
											srG = 0;
										} else {
											//SR持ってなければ終了
											break;
										}
									}

									var lp = mt.next();
									if (lp < 0.3) {
										srG++;
									}
									cards[2]--;
									if (srG >= 5) {
										lp = mt.next();
										if (lp < 0.3) {
											limitOpen += 2;
										} else {
											limitOpen++;
										}
										srG = null;
									}
								}
								break;
							case 1:
								//SR45狙いの場合
								while(cards[3] > 0) {

									//PRの合成用が無ければ確保
									if (prG === null) {
										if(cards[2] > 0) {
											cards[2]--;
											prG = 0;
										} else {
											//PR持ってなければ終了
											break;
										}
									}


									var lp = mt.next();
									if (lp < 0.3) {
										prG++;
									}
									cards[3]--;
									if (prG >= 5) {
										lp = mt.next();
										if (lp < 0.3) {
											limitOpen += 2;
										} else {
											limitOpen++;
										}
										prG = null;
									}
								}

								break;
						}
					}

					//実際に混ぜてくとこ
					for (var i = 0; i < cards.length; i++) {

						//上限開放率0%なら処理しない
						if (perList[target][i] === 0) {
							continue;
						}

						//PSRをSRの素材にするフラグがOFFなら処理しない
						if (!psrseed && i === 0) {
							continue;
						}

						while (cards[i] > 0) {
							if (mixFlag && i === 2 && cards[i] === 1) {
								break;
							}
							var lp = mt.next();
							if (lp < perList[target][i]) {
								limitOpen++;
							}
							cards[i]--;
						}
					}
				}
				if(limitOpen >= 5) {
					break;
				}

			}

			simuCount--;
			totalTryCount += tryCount;
			if (tryCount > maxCount) {
				maxCount = tryCount;
			}
			if (tryCount < minCount) {
				minCount = tryCount;
			}
//			console.log(tryCount);
//			console.log(totalCards);
		}

		console.log("min:" + minCount);
		console.log("max:" + maxCount);
		console.log(totalTryCount/SIMU_MAX_COUNT);


		var disp = $('#displayArea');
		var str = '';
		var aveCount = Math.round(totalTryCount/SIMU_MAX_COUNT);

		str += '<h4>▼シミュレーション結果</h4>';
		str += '<div class="mainText">';
		if (simFlag) {
			str += '平均して' + aveCount + '回のガチャで目標を達成しました。(金額:\\' + moneyCalc.separate(Math.round(aveCount / 30 * 9800)) + ')<br>';
			str += '最小回数は' + minCount + '回でした(金額:\\' + moneyCalc.separate(Math.round(minCount / 30 * 9800)) + ')<br>';
			str += '最大回数は' + maxCount + '回でした(金額:\\' + moneyCalc.separate(Math.round(maxCount / 30 * 9800)) + ')<br>';
		} else {
			str += totalTryCount + '回目のガチャで目標を達成しました。(金額:\\' + moneyCalc.separate(Math.round(aveCount / 30 * 9800)) + ')<br>';
			str += botaiGetCount + '回目のガチャで母体を確保しました。<br>';
			str += '対象キャラはPSR' + totalCards[0] + '枚、SR' + totalCards[1] + '枚、PR' + totalCards[2] + '枚、R' + totalCards[3] + '枚出現しました。<br>';

		}
		str += '</div>';

		disp.html(str);



	},

	separate: function(n){
		return String(n).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
	}

};
