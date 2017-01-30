/*global $, jQuery, alert, encodingParam, commonModule*/
$(function () {
	var loadSuccess = function(data) {
		abilityData = JSON.parse(data);
	},
		loadError = function(res) {
			alert("エラーが発生しました。ページを再読み込みしてください");
		};
	commonModule.getAsyncData('abilityGroupList', JSON.stringify({pageType:0}), loadSuccess, loadError);

	//ローカルストレージから査定地を表示しないフラグを取得
	var chk = localStorage.getItem('nonAssessment');
	$('#nonAssessment').prop('checked', chk !== null ? JSON.parse(chk) : false);


	$('.tabMenu').click(function () {
		var idx = $('.tabMenu').index(this);
		if (commonModule.getTabType() === idx) return;
		commonModule.setTabType(idx);
		if (idx === 0 || idx === 1) {
			commonModule.refreshDisplayAbility(idx);
			IndividModule.updateBaseAbilityRank();
			commonModule.refreshDisplaySubPosition();
		}
	});

	$('.pointInput').on('change', function () {
		var objs = $('.pointInput'),
			total = 0;
		for (var i = 0; i < objs.length; i++) {
			var value = parseInt(objs.eq(i).val(), 10);
			if (value) {
				if (value > Number(objs.eq(i).attr('max'))) {
					value = Number(objs.eq(i).attr('max'));
				} else if (value < Number(objs.eq(i).attr('min'))) {
					value = Number(objs.eq(i).attr('min'));
				}
				objs.eq(i).val(value);
				total += value;
			} else {
				objs.eq(i).val('0');
			}
		}
		$('.ownPointTotal').html(total);
	});

});


var IndividModule = (function () {
	var makingType = 0;
	var makingStr = 'batter';

	return {


		getMakingType: function () {
			return makingType;
		},

		getMakingStr: function () {
			return makingStr;
		},


		updateBaseAbilityRank: function () {
			var array = $('#tab' + (commonModule.getTabType() + 1) + ' .basePointInput');
			for (var i = 0; i < array.length; i++) {
				var value = parseInt(array.eq(i).val(), 10);
				var targetObj = $('#tab' + (commonModule.getTabType() + 1) + ' .baseRank td').eq(i);
				targetObj.removeClass();
				if (value) {
					if (value > Number(array.eq(i).attr('max'))) {
						value = Number(array.eq(i).attr('max'));
					} else if (value < Number(array.eq(i).attr('min'))) {
						value = Number(array.eq(i).attr('min'));
					}
					array.eq(i).val(value);
					if (i % 7 === 0) {
						targetObj.addClass('trajectory' + value);
					} else {
						targetObj.addClass('rank' + commonModule.getRankString(value));
					}
				} else {
					array.eq(i).val('');
				}
			}
		},

		setRandomDefault: function () {
			var obj = $('#tab1 .basePointInput'),
				rest = 150;

			//弾道
			obj.eq(0).val(Math.floor(Math.random() * 2) + 1);

			for (var i = 0; i < 5; i++) {
				var value = 15 + Math.floor(Math.random() * 21);
				if (rest - (value + (5 - i) * 35) > 0) {
					//少なすぎる場合
					var min = rest - (5 - i) * 35;
					value = min + Math.floor(Math.random() * (36 - min));
				} else if (value + (5 - i) * 15 > rest) {
					//多過ぎる場合
					var max = rest - (5 - i) * 15;
					value = 15 + Math.floor(Math.random() * (max - 14));
				}
				obj.eq(i + 1).val(value);
				rest -= value;
			}
			obj.eq(6).val(rest);

			var usehand = $("#useHand").prop('selectedIndex');
			switch (usehand % 3) {
			case 1:
				obj.eq(1).val(parseInt(obj.eq(1).val()) - 4);
				obj.eq(2).val(parseInt(obj.eq(2).val()) - 2);
				break;
			case 2:
				obj.eq(1).val(parseInt(obj.eq(1).val()) - 4);
				obj.eq(2).val(parseInt(obj.eq(2).val()) - 4);
				break;
			}
			this.updateBaseAbilityRank();
		}
	};
})();
