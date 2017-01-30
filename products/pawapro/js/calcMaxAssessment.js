/*jslint browser: true*/
/*global $, jQuery, alert, IndividModule, commonModule, charaData */
/*jslint shadow:true*/

var calcMaxAssessmentModule = (function() {
	var MAP_MAX_SIZE = 12000,
		CUT_FREQ = 10;
	return {

		calcMaxAssessment: function() {
			var basePointNow = [],
				dataAbilityNow = [],
				trickLevel = [],
				StrickLevel = [],
				baseTrickLevel = [],
				ability = [],
				expPoint = [],
				obj = $('#tab1 .basePointInput');

			commonModule.showBlockMessage('<i class="fa fa-spinner fa-pulse"></i> <span id="blockMessage">処理中...</span><div id="errorMsg"></div>');



			for (var i = 0; i < obj.length; i++) {
				basePointNow[i] = Number(obj.eq(i).val());
			}

			var abNow = charaData.getAbilityList(0);

			for (var i = 0; i < abNow.length; i++) {
				ability[i] = {
					"id":abNow[i] ? abNow[i].id: null,
					"trickLevel":charaData.getTrickLevel(i),
					"StrickLevel":charaData.getSTrickLevel(i),
				};
			}

			obj = $('.baseTrickSlider');
			for (var i = 0; i < obj.length; i++) {
				baseTrickLevel[i] = Number(obj.eq(i).labeledslider("value"));
			}


			obj = $('.pointInput');
			for (var i = 0; i < obj.length; i++) {
				expPoint[i] = Number(obj.eq(i).val());
			}

			var data = {
				"basePoint":basePointNow,
				"ability":ability,
				"baseTrickLevel": baseTrickLevel,
				"sense": charaData.getSensePer(),
				"expPoint": expPoint,
				"isCather":commonModule.isCatcher(),
				"nonMoody":$('#nonMoody').prop("checked"),
				"nonCatcher":$('#nonCatcher').prop("checked")
			};

			data = commonModule.getAsyncData('getTargetList', JSON.stringify(data));
			var map = [[[0, 0, 0, 0], [0, 0], []]];
			expPoint.splice(3, 1);
			this.RecallMaxAssessment(map, data.targetList, 0, expPoint, data.greedyMaxPoint, data.backetList, data.baseNowAssessment, data.abNowAssessment);
		},



		RecallMaxAssessment: function(map, targetList, depth, expPoint, greedyMaxPoint, backetList, baseNowAssessment, abNowAssessment) {
			//最後の階層の場合
			if(depth == targetList.length) {
				var maxIndex = 0;


				map.sort(function (m1, m2) {
					return calcMaxAssessmentModule.getRealAssessmentPoint(m2[1], baseNowAssessment, abNowAssessment) - calcMaxAssessmentModule.getRealAssessmentPoint(m1[1], baseNowAssessment, abNowAssessment);
				});

				var maxDisplayValue = 0;
				var basePointNow = [];
				var obj = $('#tab1 .basePointInput');

				for (var i = 0; i < obj.length; i++) {
					basePointNow[i] = Number(obj.eq(i).val());
				}

				var data = {
					map:map[0],
					basePoint:basePointNow,
					ability:charaData.getAbilityList(0)
				};
				data = commonModule.getAsyncData('getMaxAssessmentStatus', JSON.stringify(data));
				calcMaxAssessmentModule.finishCalcMaxAssessment(data);
				return;
			}


			var target = targetList[depth],
				mapCount = map.length;

			//mapとtargetListの掛け合わせ
			for (var i = 0; i < mapCount; i++) {
				var count = 0;
				for (var j = 0; j < target.length; j++) {
					var point = calcMaxAssessmentModule.getMultArray(map[i][0], target[j].point, expPoint);
					if(point === null){
						var rest = calcMaxAssessmentModule.getTotalPoint(expPoint) - calcMaxAssessmentModule.getTotalPoint(map[i][0]);
						if(!calcMaxAssessmentModule.isReachGreedyMaxPoint(depth, rest, map[i][1], greedyMaxPoint, backetList, baseNowAssessment, abNowAssessment)){
							if (count > 0) {
								map.splice(map.length-count, count);
							}
							break;
						}
						continue;
					}
					count++;
					var val = [map[i][1][0], map[i][1][1]];
					val[target[j].type] = val[target[j].type] + target[j].val;
					var newRoute = [];
					for (var k = 0; k < map[i][2].length; k++) {
						newRoute[k] = map[i][2][k];
					}
					newRoute[newRoute.length] = target[j].id;
					map[map.length] = [point, val, newRoute];
				}
			}

			//足切り処理
			if(map.length >= MAP_MAX_SIZE * 5 || (depth % CUT_FREQ === 0 && map.length >= MAP_MAX_SIZE)) {
				//査定値の降順でソート後、上位5000番目までを残す
				map.sort(function (m1, m2) {
					return calcMaxAssessmentModule.getRealAssessmentPoint(m2[1], baseNowAssessment, abNowAssessment) - calcMaxAssessmentModule.getRealAssessmentPoint(m1[1], baseNowAssessment, abNowAssessment);
				});
				map = map.slice(0, MAP_MAX_SIZE);
			}





			$('#blockMessage').hide().html('処理中... ' + Math.round((depth + 1)*100/targetList.length) + '%' ).show();
			setTimeout(calcMaxAssessmentModule.RecallMaxAssessment, 0, map, targetList, depth+1, expPoint, greedyMaxPoint, backetList, baseNowAssessment, abNowAssessment);

		},


		getRealAssessmentPoint: function(array, baseNowAssessment, abNowAssessment){
			var newbaseNowAssessment = baseNowAssessment + array[0];
			var newabNowAssessment = abNowAssessment + array[1];
			return newbaseNowAssessment + 7.84 * Math.round(newbaseNowAssessment/47.04) + 11.27 + newabNowAssessment;
		},


		getMultArray: function (mapPoint, targetPoint, expPoint) {
			var point = [];
			for (var i = 0; i < mapPoint.length; i++) {
				var p = mapPoint[i] + targetPoint[i];
				if (p > expPoint[i]) {
					return null;
				}
				point[i] = p;
			}
			return point;
		},


		isReachGreedyMaxPoint: function(depth, restPoint, nowEV, greedyMaxPoint, backetList, baseNowAssessment, abNowAssessment) {
			var i = 1;
			var nowEval = [nowEV[0], nowEV[1]];
			while(depth + i < backetList.length) {
				restPoint -= backetList[depth+i].total;
				if(restPoint < 0) {
					nowEval[backetList[depth+i].type] += (backetList[depth+i].val/backetList[depth+i].total) * (restPoint + backetList[depth+i].total);
					if(calcMaxAssessmentModule.getRealAssessmentPoint(nowEval, baseNowAssessment, abNowAssessment) < greedyMaxPoint) {
						return false;
					}
					break;
				}
				nowEval[backetList[depth+i].type] += backetList[depth+i].val;
				i++;
			}
			return true;
		},

		getTotalPoint: function(point) {
			var sum = 0;
			for (var i = 0; i < point.length; i++) {
				sum += point[i];
			}
			return sum;
		},


		finishCalcMaxAssessment: function(data) {
			var obj = $('#tab2 .basePointInput');

			//基礎能力
			for(var i = 0; i < data.baseAbility.length; i++) {
				obj.eq(i).val(data.baseAbility[i]);
			}

			//特能
			for (var i = 0; i < data.ability.length; i++) {
				charaData.setAbilityList(1, i, data.ability[i]);
			}

			for (var i = 0; i < charaData.getSubPosition(1).length; i++) {
				charaData.setSubPosition(1, i, charaData.getSubPosition(0, i));
			}

			//サブポジキャッチャー
			if(!commonModule.isCatcher() && charaData.getAbilityList(1, 6) !== null) {
				charaData.setSubPosition(1, 0, {id:"1", name:"捕手", color:"0"});
				$('#tab2 .subPositionList a').eq(0).addClass('selectedSubPosition');
			}


			commonModule.calcExpPoint();
			$.unblockUI();
		},

		ErrorCalcMaxAssessment: function (data) {
			$('#errorMsg').html('エラーが発生しました。管理者にお問い合わせください。');
			setTimeout($.unblockUI, 3000);
		},



	};
})();
