/*jslint browser: true, jquery: true, shadow:true */
/* global MersenneTwister, d3, ga */


$(function(){
	$('.sRate').eq(0).val(0.5);
	$('.sRate').eq(1).val(3);
	$('.sRate').eq(2).val(20.95);
	$('.sRate').eq(3).val(75.55);
});


var moneyCalc = {

	calc: function() {

		ga('send', 'event', 'action', 'click', 'moneyCalc/calc');
		moneyCalc.showBlockMessage('<div id="blockMsg"><i class="fa fa-spinner fa-pulse"></i> <span id="blockMessage">処理中...</span><div id="errorMsg"></div></div>');
		setTimeout(moneyCalc.calcMain, 500);

	},

	calcMain: function() {



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



		if (allCount+pCount <= 0) {
			d3.select('#chartArea').select("svg").remove();
			$('#displayArea').html('<i class="fa fa-warning" style="color:#f00"></i>ガチャから出現するイベキャラ数を入力してください。');
			$.unblockUI();
			return;
		}


		var perList = [
			[1, 0.3, 0.05, 0.005],
			[1, 1, 0.3, 0]
		];
		var SIMU_MAX_COUNT = simFlag ? 10000 : 1;
		var simuCount = SIMU_MAX_COUNT;
		var totalTryCount = 0;
		var maxCount = 0;
		var minCount = Number.MAX_SAFE_INTEGER;
		var sampling = [];
		var totalCards = [0, 0, 0, 0];
		var botaiGetTotalCount = 0;
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
			var botaiGetCount = 0;
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
			botaiGetTotalCount += botaiGetCount;
			if (tryCount > maxCount) {
				maxCount = tryCount;
			}
			if (tryCount < minCount) {
				minCount = tryCount;
			}

			sampling[sampling.length] = tryCount;

		}

		//平均
		var average = totalTryCount/SIMU_MAX_COUNT;

		//中央値
		sampling.sort(function(x, y){
			return parseInt(x, 10) > parseInt(y, 10) ? 1 : -1;
		});
		var centerValue = (sampling[parseInt(SIMU_MAX_COUNT/2, 10)]+sampling[parseInt(SIMU_MAX_COUNT/2, 10)-1])/2;

		//標準偏差
		var bunsan = 0;
		for (var i = 0; i < sampling.length; i++) {
			bunsan += Math.pow(sampling[i] - average, 2);
		}
		var hensa = Math.sqrt(bunsan/SIMU_MAX_COUNT);

		//出現頻度のリスト作成
		var samplingCountList = [];
		for (var i = 0; i < sampling.length; i++) {
			var idx = sampling[i];
			if (!samplingCountList[idx]) {
				samplingCountList[idx] = 0;
			}
			samplingCountList[idx]++;
		}



		var max = sampling[sampling.length-1];

		//undefinedを0に変換
		samplingCountList = samplingCountList.map(function(elt){
			return !elt ? 0 : elt;
		});

		//最頻値
		var frequency = null;
		for (var key in samplingCountList) {
			if (frequency === null || samplingCountList[key] > samplingCountList[frequency]) {
				frequency = key;
			}
		}

		var disp = $('#displayArea');
		var str = '';



		str += '<h4>▼シミュレーション結果</h4>';
		str += '<div class="mainText">';
		if (simFlag) {
			str += '平均して' + Math.round(average) + '回のガチャで目標を達成しました(金額:\\' + moneyCalc.separate(Math.round(average / 30 * 9800)) + ')<br>';
			str += '中央値は' + centerValue + '回です(金額:\\' + moneyCalc.separate(Math.round(centerValue / 30 * 9800)) + ')<br>';
			str += '最頻値は' + frequency + '回です(金額:\\' + moneyCalc.separate(Math.round(frequency / 30 * 9800)) + ')<br>';
			str += '最小回数は' + minCount + '回です(金額:\\' + moneyCalc.separate(Math.round(minCount / 30 * 9800)) + ')<br>';
			str += '最大回数は' + maxCount + '回です(金額:\\' + moneyCalc.separate(Math.round(maxCount / 30 * 9800)) + ')<br>';
			str += '標準偏差は' + Math.round(hensa) + '回です<br>';
		} else {
			str += totalTryCount + '回目のガチャで目標を達成しました。(金額:\\' + moneyCalc.separate(Math.round(totalTryCount / 30 * 9800)) + ')<br>';
			str += botaiGetTotalCount + '回目のガチャで母体を確保しました。<br>';
			str += '対象キャラはPSR' + totalCards[0] + '枚、SR' + totalCards[1] + '枚、PR' + totalCards[2] + '枚、R' + totalCards[3] + '枚出現しました。<br>';

		}
		str += '</div>';

		disp.html(str);


		var data = [];

		for (var key in samplingCountList) {
			data.push({
				'回数':parseInt(key, 10),
				'出現数':samplingCountList[key]
			});
		}

		if (simFlag) {
			moneyCalc.displayGraph(data, max, samplingCountList[frequency], average, centerValue);
		} else {
			d3.select('#chartArea').select("svg").remove();
		}

		$.unblockUI();

	},

	displayGraph: function(data, xMax, yMax, average, centerValue) {

		// 軸の分も表示されるように、マージンを作っておく。
		var margin = {top: 20, right: 20, bottom: 60, left: 40},
			width =  Math.min(640, parseInt(window.innerWidth*0.8, 10)) - margin.left - margin.right,
			height = width*2/3 - margin.top - margin.bottom;

		d3.select('#chartArea').select("svg").remove();

		// transfromでマージンの分だけ位置をずらしている。
		var svg = d3.select('#chartArea')
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var xScale = d3.scale.linear()
		.domain([0,xMax])
		.range([0,width]);

		var yScale = d3.scale.linear()
		.domain([0,Math.round(yMax*1.1)])
		.range([height,0]);

		var colorCategoryScale = d3.scale.category10();

		// 軸を設定する。
		var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.tickSize(6, -height) // 棒の長さと方向。
		.tickFormat(function(d){ return d; }); // 数字に年をつけている。

		var yAxis = d3.svg.axis()
		.ticks(5) // 軸のチックの数。
		.scale(yScale)
		.orient("left")
		.tickSize(6, -width);



		svg.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("r",2)
			.attr("fill", function(d){ return colorCategoryScale(d["増減"]); })
			.attr("cx", function(d){ return xScale(d["回数"]); })
			.attr("cy", function(d){ return yScale(d["出現数"]); });

		// gの中でyAxisをcallして、y軸を作る。
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("y", -10)
			.attr("x",10)
			.style("text-anchor", "end")
			.text("出現頻度");

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);


		var carray = [[width*(centerValue/xMax), 0], [width*(centerValue/xMax), height]];
		var line = d3.svg.line()
			.x(function(d){return d[0];})
			.y(function(d){return d[1];});

		svg.append('path')
			.attr({
				'd': line(carray),
				'stroke': 'red',
				'stroke-width': 1
		});

		svg.append("text").attr({
			x:  width*(centerValue/xMax)+10,
			y: 20,
			fill:'#f00'
		}).text("中央値");

		carray = [[width*(average/xMax), 0], [width*(average/xMax), height]];
		line = d3.svg.line()
		.x(function(d){return d[0];})
		.y(function(d){return d[1];});

		svg.append('path')
			.attr({
			'd': line(carray),
			'stroke': 'green',
			'stroke-width': 1,
		});

		svg.append("text").attr({
			x:  width*(average/xMax)+10,
			y: 40,
			fill:'green'
		}).text("平均値");


		d3.select(".x.axis")
			.append("text")
			.text("ガチャ回数")
			.attr("x", width-50)
			.attr("y", 30);
	},

	separate: function(n){
		return String(n).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
	},

	showBlockMessage: function (msg) {
		$.blockUI({
			message: msg,
			css:{
				border: 'none',
				padding: '15px',
				left: '10%',
				width:'80%',
				'-webkit-border-radius': '10px',
				'-moz-border-radius':'10px',
				opacity: '.8',
				color:'#000',
				'font-size':'1em'
			}
		});
	},


};
