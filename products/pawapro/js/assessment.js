/*jshint jquery: true */
/*global abilityList */
/*jslint shadow:true*/

$(function() {
	$('#ui-tab').tabs();

	$(document).on('confirmation', '#abilityDetail', function () {
		module.ConfirmRemodal();
	});

	charaData.init(abilityList);
	$('.basePointInput').on('change', module.changeBaseAbility);
	module.calcAssessmentPoint();

});

var charaData = (function() {
	var abilityList = [];	//{id:'', name:'', type:''}
	return {

		//配列初期化
		init: function() {
			var size = $('#abilityButtonList li');

			for (var i = 0; i < size; i++) {
				abilityList[i] = null;
			}

		},

		getAbilityList: function(idx) {
			return typeof(idx) === "undefined" ? abilityList : abilityList[idx];
		},

		setAbilityList: function(idx, val) {
			abilityList[idx] = val;
		}
	};
})();


var module = (function() {
	var selectAbility,
		selectedDisplayIndex,
		checkVal = 0,
		abTypeClass = ['selectedAbility', 'selectedSAbility', 'selectedBAbility', 'selectedPAbility', 'selectedHAbility', 'selectedGAbility'];

	return {
		openAbilityDetail: function (displayIndex, id) {
			var list = [],
				str = '';
			list = abilityList.filter(function(elt) {
				return Number(elt.headerId) === id;
			});



			for (var i = 0; i < list.length; i++) {
				if(list[i].type === 0 ||list[i].type === 1 || list[i].type === 4 || list[i].type === 5) {
					str += '<li><label><input type="radio" name="abilityGroup" value="' + list[i].id + '" abType="' + list[i].type + '"><span>' + list[i].name + '</label></li>';
				}
			}

			$('#abilityDetailList').html(str);

			//現在のキャラ状態を取得し、画面に反映
			var checkAbility = charaData.getAbilityList(displayIndex);
			if (checkAbility) {
				checkVal = checkAbility.id;
				$("input[name=abilityGroup]").val([checkAbility.id]);
				$("input[name=abilityGroup]:checked").closest("label").addClass(abTypeClass[checkAbility.type]);
			} else {
				checkVal = null;
			}

			//表示切替
			selectAbility = id;
			selectedDisplayIndex = displayIndex;

			//ラジオボタンにクリック処理を加える
			$("input[name=abilityGroup]").click(function(){
				$("input[name=abilityGroup]").closest("label").removeClass(abTypeClass.join(' '));
				if($(this).val() == checkVal) {
					$(this).prop('checked', false);
					checkVal = null;
				} else {
					checkVal = $(this).val();
					$(this).closest("label").addClass(abTypeClass[Number($(this).attr('abType'))]);
				}
				module.ConfirmRemodal();
				$.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')].close();
			});

			$.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')].open();

		},

		ConfirmRemodal: function() {

			var obj = $('.abilityButtonList li').eq(selectedDisplayIndex);
			obj.removeClass(abTypeClass.join(' '));
			if(checkVal) {
				var ability = abilityList.filter(function(elt) {
					return elt.id === checkVal;
				});

				if(ability.length > 0) {
					ability = ability[0];
					charaData.setAbilityList(selectedDisplayIndex, {id:checkVal, name:ability.name, type:ability.type});
					obj.addClass(abTypeClass[Number(ability.type)]);
					obj.find('a').html(ability.name);
				}
			} else {
				charaData.setAbilityList(selectedDisplayIndex, null);
				obj.find('a').html(obj.find('a').attr('default'));
			}
			module.calcAssessmentPoint();
		},

		calcAssessmentPoint: function () {
			var basePoint = 0,
				obj = $('.basePointInput');

			for (var i = 0; i < obj.length; i++) {
				if(obj.eq(i).val()) {
					basePoint += baseAbilityList[i][Number(obj.eq(i).val())-1];
				}
			}

			basePoint = basePoint + 7.84 * Math.round(basePoint/47.04);

			var list = charaData.getAbilityList().filter(function (elt) {
				return elt;
			});
			var abilityPoint= 0;
			if (list.length >= 0) {
				for (var i = 0; i < list.length; i++) {
					var ability = module.getAbility(abilityList, list[i].id);

					while(ability){
						abilityPoint += Number(ability.assessment);
						ability = module.getAbility(abilityList, ability.lower);
					}
				}
			}

			var total = parseInt((basePoint + abilityPoint) / 14, 10) * 14;
				rankStr = '';

			for (var i = 0; i < rankData.length; i++) {
				if (total >= rankData[i].pointFrom && total < rankData[i].pointTo) {
					rankStr = rankData[i].rankStr;
				}
			}

			$('#assessmentDisplay').html(rankStr + '(査定値:' + total + '  / 実査定値:' + (Math.round((basePoint + abilityPoint) * 100) / 100) + ')');


		},

		getAbility: function (abilityList, id) {
			for (var i = 0; i < abilityList.length; i++) {
				if(abilityList[i].id === id) {
					return abilityList[i];
				}
			}
			return null;
		},

		changeBaseAbility: function () {
			var array = $('.basePointInput');
			for (var i = 0; i < array.length; i++) {
				var value = parseInt(array.eq(i).val(), 10);
				if (value) {
					if (value > Number(array.eq(i).attr('max'))) {
						value = Number(array.eq(i).attr('max'));
					} else if (value < Number(array.eq(i).attr('min'))) {
						value = Number(array.eq(i).attr('min'));
					}
					array.eq(i).val(value);
				} else {
					array.eq(i).val('');
				}
			}
			module.calcAssessmentPoint();
		},



	};
})();
