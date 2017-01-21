/*global $, jQuery, alert, encodingParam, commonModule*/
/*jslint shadow:true*/

$(function() {
	var loadSuccess = function(data) {
		abilityData = JSON.parse(data);
	},
		loadError = function(res) {
			alert("エラーが発生しました。ページを再読み込みしてください");
		};

	commonModule.getAsyncData('abilityGroupList', JSON.stringify({pageType:1}), loadSuccess, loadError);

	$('.changeBallInput').on('change', IndividModule.updateChangeBallRank);
	$('.tabMenu').click(function() {
		var idx = $('.tabMenu').index(this);
		if(commonModule.getTabType() === idx) return;
		commonModule.setTabType(idx);
		if (idx === 0 || idx === 1) {
			commonModule.refreshDisplayAbility(idx);
			IndividModule.updateBaseAbilityRank();
			IndividModule.updateChangeBallRank();
			commonModule.refreshDisplaySubPosition();
		}
	});

});

var IndividModule = (function() {
	var makingType = 1;

	return {

		getMakingType: function () {
			return makingType;
		},

		updateBaseAbilityRank : function () {
			var array = $('#tab' + (commonModule.getTabType() + 1) + ' .basePointInput');
			for (var i = 0; i < array.length; i++) {
				var value = parseInt(array.eq(i).val(), 10);
				var targetObj = $('#tab' + (commonModule.getTabType() + 1) + ' .baseRank td').eq(i);
				targetObj.removeClass();
				if(value) {
					if(value > Number(array.eq(i).attr('max'))) {
						value = Number(array.eq(i).attr('max'));
					} else if (value < Number(array.eq(i).attr('min'))){
						value = Number(array.eq(i).attr('min'));
					}
					array.eq(i).val(value);
					if (i % 7 !== 0) {
						targetObj.addClass('rank' + commonModule.getRankString(value));
					}
				} else {
					array.eq(i).val('');
				}
			}
		},

		updateChangeBallRank: function() {
			var array = $('#tab' + (commonModule.getTabType() + 1) + ' .changeBallInput');
			var imgArray = ['st2', 'l', 'ld', 'd', 'rd', 'r'];
			for (var i = 0; i < array.length; i++) {
				var value = parseInt(array.eq(i).val(), 10);
				var targetObj = $('#tab' + (commonModule.getTabType() + 1) + ' .changeBallRank td').eq(i);
				targetObj.find('div').removeClass();
				if(value > 0) {
					targetObj.find('div').addClass(imgArray[i]);
					targetObj.find('div > span').html(value);
				} else {
					targetObj.find('div > span').html('');
				}
			}
		},

		setRandomDefault: function () {
			var obj = $('#tab1 .basePointInput'),
				rest = 150;

			//球速
			obj.eq(0).val(120 + Math.floor(Math.random() * 11));

			//コン・スタ
			for(var i=1;i<obj.length;i++){
				obj.eq(i).val(20+Math.floor(Math.random() * 21));
			}

			//変化球
			obj = $('#tab1 .changeBallType');
			for(var i=0;i<obj.length;i++){
				obj.eq(i).prop('selectedIndex', 0);
				$('#tab1 .changeBallInput').eq(i).val(0);
			}
			if(Math.random() < 0.2){
				$('#tab1 .changeBallInput').eq(1+Math.floor(Math.random() * 5)).val(1);
			}

			this.updateBaseAbilityRank();
			this.updateChangeBallRank();


		}

	};
})();
