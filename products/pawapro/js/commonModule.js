/*jslint browser: true*/
/*global $, alert, IndividModule, ga, abilityCount */
/*jslint shadow:true*/

var abilityData = null;

$(function() {

	//ローカルストレージから査定値を表示しないフラグを取得
//	var chk = localStorage.getItem('nonAssessment');
//	$('#nonAssessment').prop('checked', chk !== null ? JSON.parse(chk) : false);

	$('#ui-tab').tabs();
	$("#abilitySlider").labeledslider({value:0, min: 0, max: 5, range:"min", change:commonModule.setAbilityPointValue});
	$("#SabilitySlider").labeledslider({value:0, min: 0, max: 5, range:"min", change:commonModule.setAbilityPointValue});
	$(".baseTrickSlider").labeledslider({value:0, min: 0, max: 5, range:"min"});
	$(".changeBallTrickSlider").labeledslider({value:0, min: 0, max: 5, range:"min"});

	$(document).on('confirmation', '#abilityModal', function () {
		commonModule.ConfirmRemodal();
	});

	$(document).on('cancellation', '#abilityModal', function () {
		commonModule.CancelRemodal();
	});

	$(document).on('confirmation', '#subPositionModal', function () {
		commonModule.ConfirmSubPositionModal();
	});

	$(document).on('cancellation', '#subPositionModal', function () {
		commonModule.CancelSubPositionModal();
	});

	//センス○×のラジオボタンにクリック処理を加える
	$("input[name=senseGroup]").click(charaData.clickSense);

	$('.basePointInput').on('change', IndividModule.updateBaseAbilityRank);

	$('#sendFile').on('change', function (e) {
		commonModule.setPreviewImage(e);
	});

	//特能一覧取得
	commonModule.getAsyncData(
		'abilityGroupList',
		JSON.stringify({pageType:IndividModule.getMakingType()}),
		function(data) {
			abilityData = JSON.parse(data);
			var param = commonModule.GetQueryString();
			if(param.userId && param.charaId) {
				var data = {'userId':Number(param.userId), 'charaId':param.charaId};
				commonModule.getAsyncData('getCharacter', JSON.stringify(data), function (res) {
					if (res.data) {
						$('#characterId').val(res.charaId);
						$('#charaImg').attr('src', res.imgURL);
						charaData.setSaveData(res.data);
						IndividModule.updateBaseAbilityRank();
						if(typeof IndividModule.updateChangeBallRank !== 'undefined') {
							IndividModule.updateChangeBallRank();
						}
						commonModule.refreshDisplayAbility(0);
						commonModule.refreshDisplaySubPosition();
						commonModule.calcExpPoint();
						$('.shareLinkBody').html(window.location.href);
					}

				});
			}


		},
		function() {
			alert("エラーが発生しました。ページを再読み込みしてください");
		}
	);

	charaData.init();

	commonModule.setTabType(0);
//	$('.pointInput').eq(0).val(0);
//	$('.pointInput').eq(1).val(0);
//	$('.pointInput').eq(2).val(0);
//	$('.pointInput').eq(3).val(0);
//	$('.pointInput').eq(4).val(0);

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


//選手データ格納クラス
var charaData = (function() {
	var abilityList = [[], []],	//{id:'', name:'', type:''}
		trickLevel = [],
		StrickLevel = [],
		subPosition = [[], []],	//{id:'', name:'', type:''}
		sense = 0;

	return {

		//配列初期化
		init: function () {
			var size = abilityCount;

			for (var i = 0; i < size; i++) {
				abilityList[0][i] = null;
				abilityList[1][i] = null;
				trickLevel[i] = 0;
				StrickLevel[i] = 0;
			}

			size = $('#tab1 a[name=subPosition]').length;
			for (var i = 0; i < size; i++) {
				subPosition[0][i] = null;
				subPosition[1][i] = null;
			}
		},

		getAbilityList: function (type, idx) {
			return typeof(idx) === "undefined" ? abilityList[type] : abilityList[type][idx];
		},

		setAbilityList: function (type, idx, val) {
			abilityList[type][idx] = val;
		},

		getTrickLevel: function (idx) {
			return typeof(idx) === "undefined" ? trickLevel : trickLevel[idx];
		},

		setTrickLevel: function (idx, val) {
			trickLevel[idx] = val;
		},

		getSTrickLevel: function (idx) {
			return typeof(idx) === "undefined" ? StrickLevel : StrickLevel[idx];
		},

		setSTrickLevel: function (idx, val) {
			StrickLevel[idx] = val;
		},

		getSubPosition: function (type, idx) {
			return typeof(idx) === "undefined" ? subPosition[type] : subPosition[type][idx];
		},

		setSubPosition: function (type, idx, val) {
			subPosition[type][idx] = val;
		},

		syncroAbility: function (idx) {
			if (abilityList[0][idx] !== null && abilityList[1][idx] === null) {
				abilityList[1][idx] = abilityList[0][idx];
			}
		},

		syncroSubPosition: function(idx) {
			if (subPosition[0][idx] !== null && subPosition[1][idx] === null) {
				subPosition[1][idx] = subPosition[0][idx];
			}
		},

		clickSense: function () {
			$("input[name=senseGroup]").closest("label").removeClass('selectedSense');
			if($(this).val() == sense) {
				$(this).prop('checked', false);
				sense = 0;
			} else {
				sense = $(this).val();
				$(this).closest("label").addClass('selectedSense');
			}
		},

		getSense: function () {
			return sense;
		},

		getSensePer: function () {
			return 1 - Number(sense)/10;
		},

		fetchBasePoint: function (type) {
			var obj = $('#tab'+ (type + 1) + ' .basePointInput'),
				list = [];
			for (var i = 0; i < obj.length; i++) {
				list[i] = Number(obj.eq(i).val());
			}
			return list;
		},

		fetchBaseTrickLevel: function () {
			var obj = $('.baseTrickSlider'),
				list = [];
			for (var i = 0; i < obj.length; i++) {
				list[i] = Number(obj.eq(i).labeledslider("value"));
			}
			return list;
		},

		fetchBaseLimitBreak: function() {
			var obj = $('.baseLimitBreak'),
				list = [];
			for (var i = 0; i < obj.length; i++) {
				list[i] = Number(obj.eq(i).val());
			}
			return list;
		},

		fetchChangeBall: function (type) {
			var obj = $('#tab'+ (type + 1) + ' .changeBallInput'),
				list = [];
			for (var i = 0; i < obj.length; i++) {
				var v = Number(obj.eq(i).val());
				if(v > 0) {
					list[i] = {type:$('#tab'+ (type + 1) + ' .changeBallType').eq(i).val(), value:v};
				} else {
					list[i] = null;
				}
			}
			return list;
		},

		fetchChangeBallTrickLevel: function() {
			var obj = $('.changeBallTrickSlider'),
				list = [];
			for (var i = 0; i < obj.length; i++) {
				list[i] = Number(obj.eq(i).labeledslider("value"));
			}
			return list;
		},

		getSaveData: function (type) {
			var abilitys = [
				abilityList[0].map(function(elem) {
					return elem ? elem.id : null;
				}),
				abilityList[1].map(function(elem) {
					return elem ? elem.id : null;
				})
			];
			var data = {
				charaType:type,
				name:$('#charaName').val(),
				mainPosition:$('#mainPosition').val(),
				useHand:$('#useHand').val(),
				basePoint:[this.fetchBasePoint(0), this.fetchBasePoint(1)],
				baseTrickLevel:this.fetchBaseTrickLevel(),
				baseLimitBreak:this.fetchBaseLimitBreak(),
				ability:abilitys,
				trickLevel:trickLevel,
				StrickLevel:StrickLevel,
				subPosition:subPosition.map(function(elem) {
					return elem.map(function(e) {
						return e ? e.id : null;
					});
				}),
				sense:sense,
			};
			if (type === 1) {
				data.changeBall = [this.fetchChangeBall(0), this.fetchChangeBall(1)];
				data.changeBallTrickLevel = this.fetchChangeBallTrickLevel();
			}
			return data;
		},

		setSaveData: function (data) {
			var obj = $('#tab1 .basePointInput');
			for (var i = 0; i < data.basePoint[0].length; i++) {
				obj.eq(i).val(data.basePoint[0][i]);
			}
			obj = $('#tab2 .basePointInput');
			for (var i = 0; i < data.basePoint[1].length; i++) {
				obj.eq(i).val(data.basePoint[1][i]);
			}

			obj = $('.baseTrickSlider');
			for (var i = 0; i < data.baseTrickLevel.length; i++) {
				obj.eq(i).labeledslider("value", data.baseTrickLevel[i]);
			}

			obj = $('.baseLimitBreak');
			if(data.baseLimitBreak) {
				for (var i = 0; i < data.baseTrickLevel.length; i++) {
					obj.eq(i).val(data.baseLimitBreak[i]);
				}
			}


			var abData = commonModule.getAsyncData('convertSaveAbility', JSON.stringify({ability:data.ability}));
			for (var i = 0; i < abData[0].length; i++) {
				abilityList[0][i] = abData[0][i];
				abilityList[1][i] = abData[1][i];
				trickLevel[i] = data.trickLevel[i];
				StrickLevel[i] = data.StrickLevel[i];
			}

			subPosition = commonModule.getAsyncData('convertSaveSubPosition', JSON.stringify({subPosition:data.subPosition}));


			$('#charaName').val(data.name);
			$('#mainPosition').val(data.mainPosition);
			$('#useHand').val(data.useHand);

			if(Number(data.sense) !== 0) {
				$("input[name=senseGroup]").eq(Number(data.sense) > 0 ? 0 : 1).trigger('click');
			}

			if(data.changeBall) {
				obj = $('#tab1 .changeBallInput');
				for (var i = 0; i < data.changeBall[0].length; i++) {
					if(data.changeBall[0][i]) {
						$('#tab1 .changeBallType').eq(i).val(data.changeBall[0][i].type);
						obj.eq(i).val(data.changeBall[0][i].value);
					}
				}

				obj = $('#tab2 .changeBallInput');
				for (var i = 0; i < data.changeBall[1].length; i++) {
					if(data.changeBall[1][i]) {
						$('#tab2 .changeBallType').eq(i).val(data.changeBall[1][i].type);
						obj.eq(i).val(data.changeBall[1][i].value);
					}
				}

			}



		}

	};
})();


var commonModule = (function() {
	var modalMode = 0,
		tabType = 0,
		checkVal = 0,
		selectAbility = 0,
		selectedDisplayIndex = 0,
		scrollHeight = 0,
		abTypeClass = ['selectedAbility', 'selectedSAbility', 'selectedBAbility', 'selectedPAbility', 'selectedHAbility', 'selectedGAbility'],
		subposTypeClass = ['catcher', 'infield', 'outfield', 'pitcher'],
		abilityGroupList = null;

	return {

		setTabType: function (type) {
			tabType = type;
		},

		getTabType: function () {
			return tabType;
		},

		//モーダルウインドウを開く
		openModalWindow: function (type) {
			modalMode = 0;
			tabType = type;
			this.switchModalScreen(0);

			commonModule.refreshAbilityList();
			$.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')].open();
		},


		//特能詳細画面を開く
		openAbilityDetail: function (displayIndex, id, mode) {
			scrollHeight = $('.remodal-wrapper').scrollTop();
			id = Number(id);
			if(abilityData === null) {
				return;
			}
			var data = abilityData.filter(function(e){
				return e.id === id;
			})[0].list;
			var str = '';

			//特能一覧作成
			data.forEach(function (element) {
				str += '<li><label><input type="radio" name="abilityGroup" value="' + element.id + '" abType="' + element.type + '"><span>' + element.name + '</span></label></li>';
			});
			abilityGroupList = data;
			$('#abilityDetailList').html(str);


			//現在のキャラ状態を取得し、画面に反映
			var checkAbility = charaData.getAbilityList(tabType, id);
			if (checkAbility) {
				checkVal = checkAbility.id;
				$("input[name=abilityGroup]").val([checkAbility.id]);
				$("input[name=abilityGroup]:checked").closest("label").addClass(abTypeClass[checkAbility.type]);
			} else {
				checkVal = null;
			}

			var trickSliderDisplay = false,
				StrickSliderDisplay = false;
			for (var i = 0; i < data.length; i++) {
				switch(Number(data[i].type)) {
					case 0:
					case 4:
						trickSliderDisplay = true;
						break;
					case 1:
						StrickSliderDisplay = true;
						break;
				}
			}
			$('#abilityTrickSliderDiv').removeClass('hiddenDisplay');
			if (!trickSliderDisplay) {
				$('#abilityTrickSliderDiv').addClass('hiddenDisplay');
			}
			$('#abilityStrickSliderDiv').removeClass('hiddenDisplay');
			if (!StrickSliderDisplay) {
				$('#abilityStrickSliderDiv').addClass('hiddenDisplay');
			}
			$('.abilityPointTable').removeClass('hiddenDisplay');
			if (!trickSliderDisplay && !StrickSliderDisplay) {
				$('.abilityPointTable').addClass('hiddenDisplay');
			}


			$("#abilitySlider").labeledslider("value", charaData.getTrickLevel(id));
			$("#SabilitySlider").labeledslider("value", charaData.getSTrickLevel(id));


			//表示切替
			this.switchModalScreen(1);
			modalMode = typeof(mode) === 'undefined' ? 1 : mode;
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
				commonModule.setAbilityPointValue();
			});


		},

		openAbilityDetailDirect: function (id) {
			if(abilityData === null) {
				return;
			}
			commonModule.openAbilityDetail(-1, Number(id), 2);
			$.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')].open();
		},


		setAbilityPointValue: function () {
			var point = [0, 0, 0, 0, 0];
			var index = $('input[name=abilityGroup]').index($('input[name=abilityGroup][value='+checkVal+']'));
			var trickMagList = [1, 0.7, 0.5, 0.4, 0.3, 0.2];
			if (index !== -1) {
				var id = abilityGroupList[index].id;
				while(id) {
					var ability = getAbility(abilityGroupList, id);
					var type = Number(ability.type);
					if (type === 2 || type === 3 ) {
						break;
					}
				   switch (type) {
						case 0:
						case 4:
						   var mag = (1 - 0.1 * charaData.getSense())* trickMagList[Number($("#abilitySlider").labeledslider("value"))];
							for (var i = 0; i < ability.point.length; i++) {
								point[i] += parseInt(ability.point[i] * mag, 10);
							}
							break;
						case 1:
						   var mag = (1 - 0.1 * charaData.getSense()) * trickMagList[Number($("#SabilitySlider").labeledslider("value"))];
						   for (var i = 0; i < ability.point.length; i++) {
							   point[i] += parseInt(ability.point[i] * mag, 10);
						   }
							break;
					}
					id = ability.lower;
				}
			}
			var total = 0;
			for (var i = 0; i < point.length; i++) {
				$('.abilityPointTable tr td').eq(i).html(point[i]);
				total += point[i];
			}
			$('.abilityPointTable tr td').eq(5).html(total);

			function getAbility(list, id) {
				for(var i = 0; i < list.length; i++) {
					if(list[i].id === id){
						return list[i];
					}
				}
				return null;
			}

		},

		getAsyncData: function (method, data, callBackSuccess, callBackError) {
			if (typeof(callBackSuccess) !== 'undefined') {
				$.ajax({
					type: "POST",
					url: method + '.php',
					data: data || {},
					timeout: 5000,
					success: callBackSuccess,
					error: callBackError
				});
				return null;
			}
			var temp = $.ajax({
				type: "POST",
				url: method + '.php',
				data: data || {},
				async: false
			}).responseText;
			return JSON.parse(temp);
		},

		getAsyncDataValue: function (method, data) {
			return $.ajax({
				type: "POST",
				url: method + '.php',
				data: data,
				async: false
			}).responseText;
		},

		ConfirmRemodal: function () {
			switch(modalMode) {
				case 0:

					commonModule.refreshDisplayAbility();
					$.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')].close();
					break;
				case 1:
				case 2:
					var chekedObj = $("input[name=abilityGroup]:checked");
					var val = chekedObj.val();
					var idx = $("input[name=abilityGroup]").index($("input[name=abilityGroup]:checked"));
					var textObj = $('#abSelectList > ul > li').eq(selectedDisplayIndex).find('a');
					$('#abSelectList > ul > li').eq(selectedDisplayIndex).removeClass(abTypeClass.join(' '));
					if (val) {
						charaData.setAbilityList(tabType, selectAbility, {id:val, name:chekedObj.find('+ span').text(), type:Number(chekedObj.attr('abType'))});
						if(abilityGroupList[idx].pair) {
							charaData.setAbilityList(tabType, abilityGroupList[idx].pair, null);
							if (tabType === 0 && charaData.getAbilityList(1, abilityGroupList[idx].pair)) {
								charaData.setAbilityList(1, abilityGroupList[idx].pair, null);
							}
						}
					} else {
						charaData.setAbilityList(tabType, selectAbility, null);
					}
					if (tabType === 0) {
						charaData.syncroAbility(selectAbility);
					}


					charaData.setTrickLevel(selectAbility, $("#abilitySlider").labeledslider("value"));
					charaData.setSTrickLevel(selectAbility, $("#SabilitySlider").labeledslider("value"));

					commonModule.refreshAbilityList();


					$("input[name=abilityGroup]").prop('checked', false);

					if (modalMode === 2) {
						this.refreshDisplayAbility();
						$.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')].close();
					} else {
						this.switchModalScreen(0);
						$('.remodal-wrapper').scrollTop(scrollHeight);
					}
					modalMode = 0;
					break;

			}
		},

		CancelRemodal: function () {
			switch(modalMode) {
				case 0:
					commonModule.refreshDisplayAbility();
					$.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')].close();
					break;
				case 1:
					this.switchModalScreen(0);
					modalMode = 0;
					$('.remodal-wrapper').scrollTop(scrollHeight);
					$("input[name=abilityGroup]").prop('checked', false);
					break;
				case 2:
					$.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')].close();
					break;
			}
		},

		ConfirmSubPositionModal: function () {
			var selectedIndex = $('input[name=subPositionGroup]').index($("input[name=subPositionGroup]:checked"));
			var textObj = $('#tab' + (tabType + 1) +' .displaySubPosition > ul > li').eq(selectAbility).find('a');
			$('#tab' + (tabType + 1) +' .displaySubPosition > ul > li').eq(selectAbility).find('a').removeClass(subposTypeClass.join(' '));
			if (selectedIndex !== -1) {
				charaData.setSubPosition(tabType, selectAbility, abilityGroupList[selectedIndex]);
				$('#tab' + (tabType + 1) +' .displaySubPosition > ul > li').eq(selectAbility).find('a').addClass(subposTypeClass[abilityGroupList[selectedIndex].color]);
				textObj.html(abilityGroupList[selectedIndex].name);
				if (tabType === 0 && charaData.getSubPosition(1, selectAbility) === null) {
					charaData.syncroSubPosition(selectAbility);
					$('#tab2 .displaySubPosition > ul > li').eq(selectAbility).find('a').removeClass(subposTypeClass.join(' ')).addClass(subposTypeClass[abilityGroupList[selectedIndex].color]).html(abilityGroupList[selectedIndex].name);
				}
			} else {
				charaData.setSubPosition(tabType, selectAbility, null);
				textObj.html(textObj.attr('default'));
				if (tabType === 1) {
					charaData.setSubPosition(0, selectAbility, null);
					$('#tab1 .displaySubPosition > ul > li').eq(selectAbility).find('a').removeClass(subposTypeClass.join(' ')).html(textObj.attr('default'));
				}
			}

			$.remodal.lookup[$('[data-remodal-id=subPositionModal]').data('remodal')].close();

		},

		CancelSubPositionModal: function () {
			$.remodal.lookup[$('[data-remodal-id=subPositionModal]').data('remodal')].close();

		},

		//特能ウインドウの状態を切り替える
		//0:全特能表示
		//1:特能詳細表示
		switchModalScreen: function (type) {
			var array = ['hiddenDisplay', 'visibleDisplay'];
			$('#abilityList').removeClass(array[type]).addClass(array[(type + 1) % 2]);
			$('#abilityDetail').removeClass(array[(type + 1) % 2]).addClass(array[type]);
		},


		openSubPositionDetail : function (type, idx, id) {
			var data = this.getAsyncData('getSubPositionDetail', JSON.stringify({'data': id}));
			var str = '';

			abilityGroupList = data;

			//特能一覧作成
			data.forEach(function (element) {
				str += '<li><label><input type="radio" name="subPositionGroup" value="' + element.id + '"><span>' + element.name + '</span></label></li>';
			});

			$('#subPositionDetailList').html(str);

			//現在のキャラ状態を画面に反映
			var nowSubPos = charaData.getSubPosition(tabType, idx);
			if (nowSubPos) {
				checkVal = nowSubPos.id;
				$("input[name=subPositionGroup]").val([checkVal]);
				$("input[name=subPositionGroup]:checked").closest("label").addClass(subposTypeClass[abilityGroupList[0].color]);
			} else {
				checkVal = null;
			}

			//ラジオボタンにクリック処理を加える
			$("input[name=subPositionGroup]").click(function(){
				$("input[name=subPositionGroup]").closest("label").removeClass(subposTypeClass.join(' '));
				if($(this).val() == checkVal) {
					$(this).prop('checked', false);
					checkVal = null;
				} else {
					checkVal = $(this).val();
					$(this).closest("label").addClass(subposTypeClass[abilityGroupList[0].color]);
				}
			});


			selectAbility = idx;
			tabType = type;
			$.remodal.lookup[$('[data-remodal-id=subPositionModal]').data('remodal')].open();
		},

		refreshDisplayAbility: function (idx) {
			//選択済み特能全取得
			if (typeof(idx) === 'undefined') {
				idx = tabType;
			}
			var abilityList = charaData.getAbilityList(idx);
			var str = '<ul class="abilityDisplay">';
			var count = 0;

			for (var i = 0; i < abilityData.length; i++) {
				var id = abilityData[i].id;

				if (abilityList[id] !== null) {
					var ability = abilityList[id];
					if (ability) {
						var changeTypeStr = '';
						if(idx === 1) {
							changeTypeStr = charaData.getAbilityList(0, id) === null ? '<span>new</span>' : (ability.id === charaData.getAbilityList(0, id).id ? '' : '<span><i class="fa fa-level-up changeIcon" aria-hidden="true"></i><i class="fa fa-level-up changeIcon" aria-hidden="true"></i></span>');
						}
						str += '<li class="' + abTypeClass[Number(ability.type)] + '"><a onclick="javascript:commonModule.openAbilityDetailDirect(\'' + id +'\')">' + ability.name + changeTypeStr + '</a></li>';
						count++;
					}

				}
			}
			str += '</ul>';

			$('#tab' + (idx + 1) +' .displayAbility').html(str);
			$('#tab' + (idx + 1) +' .abilityCount').html(count + '個');

		},

		refreshAbilityList: function () {
			var chekedObj = $("input[name=abilityGroup]:checked");
			var val = chekedObj.val();
			var textObjArray = $('#abSelectList > ul > li');
			var remClass = abTypeClass.join(' ');
			for (var i = 0; i < textObjArray.length; i++) {
				var obj = textObjArray.eq(i);
				var aObj = obj.find('a');
				var ability = charaData.getAbilityList(tabType, Number(aObj.attr('headerId')));
				obj.removeClass(remClass);
				if (ability) {
					obj.addClass(abTypeClass[ability.type]);
					aObj.html(ability.name);
				} else {
					aObj.html(aObj.attr('defaultName'));
				}

				//コツ持ち時にマーク付け
				var idx = Number(obj.attr('idx'));
				if(charaData.getTrickLevel(idx) !== 0 || charaData.getSTrickLevel(idx)) {
					obj.addClass('hasTrick');
				} else {
					obj.removeClass('hasTrick');
				}
			}
		},

		refreshDisplaySubPosition: function () {
			var list = charaData.getSubPosition(tabType);

			for (var i = 0; i < list.length; i++) {
				$('#tab' + (tabType + 1) +' .displaySubPosition > ul > li').eq(i).find('a').removeClass(subposTypeClass.join(' '));
				var textObj = $('#tab' + (tabType + 1) +' .displaySubPosition > ul > li').eq(i).find('a');
				if (list[i] !== null) {
					$('#tab' + (tabType + 1) +' .displaySubPosition > ul > li').eq(i).find('a').addClass(subposTypeClass[list[i].color]);
					textObj.html(list[i].name);
				} else {
					textObj.html(textObj.attr('default'));
				}
			}

		},

		calcExpPoint: function () {
			var basePointNow = [],
				basePointAim = [],
				dataAbilityNow = [],
				dataAbilityAim = [],
				trickLevel = [],
				StrickLevel = [],
				baseTrickLevel = [],
				subPositionNow = [],
				subPositionAim = [],
				changeBallType = null,
				changeBallTrickLevel = null,
				changeBallNow = null,
				changeBallAim = null,
				pageType = 0,
				obj = $('#tab1 .basePointInput');
			for (var i = 0; i < obj.length; i++) {
				basePointNow[i] = Number(obj.eq(i).val());
			}

			obj = $('#tab2 .basePointInput');
			for (var i = 0; i < obj.length; i++) {
				basePointAim[i] = Number(obj.eq(i).val());
			}
			var abNow = charaData.getAbilityList(0);
			var abAim = charaData.getAbilityList(1);

			for (var i = 0; i < abNow.length; i++) {
				if ((abNow[i] !== null || abAim[i] !== null) && (abNow[i] ? abNow[i].id : null) !== (abAim[i] ? abAim[i].id : null)) {
					dataAbilityNow[dataAbilityNow.length] = (abNow[i] ? abNow[i].id : null);
					dataAbilityAim[dataAbilityAim.length] = (abAim[i] ? abAim[i].id : null);
					trickLevel[trickLevel.length] = charaData.getTrickLevel(i);
					StrickLevel[StrickLevel.length] = charaData.getSTrickLevel(i);
				}
			}
			obj = $('.baseTrickSlider');
			for (var i = 0; i < obj.length; i++) {
				baseTrickLevel[i] = Number(obj.eq(i).labeledslider("value"));
			}

			var posNow = charaData.getSubPosition(0);
			var posAim = charaData.getSubPosition(1);
			for (var i = 0; i < posNow.length; i++) {
				if ((posNow[i] !== null || posAim[i] !== null) && (posNow[i] ? posNow[i].id : null) !== (posAim[i] ? posAim[i].id : null)) {
					subPositionNow[subPositionNow.length] = Number((posNow[i] ? posNow[i].id : null));
					subPositionAim[subPositionAim.length] = Number((posAim[i] ? posAim[i].id : null));
				}
			}

			//変化球部分
			obj = $('#tab2 .changeBallType');
			if (obj.length > 0) {
				changeBallType = [];
				changeBallNow = [];
				changeBallAim = [];
				changeBallTrickLevel = [];
				for (var i = 0; i < obj.length; i++) {
					changeBallType[i] = Number(obj.eq(i).val());
				}

				obj = $('#tab2 .changeBallInput');
				for (var i = 0; i < obj.length; i++) {
					changeBallNow[i] = Number($('#tab1 .changeBallInput').eq(i).val());
					changeBallAim[i] = Number(obj.eq(i).val());
				}

				obj = $('.changeBallTrickSlider');
				for (var i = 0; i < obj.length; i++) {
					changeBallTrickLevel[i] = Number(obj.eq(i).labeledslider("value"));
				}
				pageType = 1;
			}

			var data = {
				"now":{"basePoint":basePointNow, ability:dataAbilityNow, subPosition:subPositionNow, changeBall:changeBallNow},
				"aim":{"basePoint":basePointAim, ability:dataAbilityAim, subPosition:subPositionAim, changeBall:changeBallAim},
				"trickLevel":trickLevel,
				"StrickLevel":StrickLevel,
				"baseTrickLevel": baseTrickLevel,
				"changeBallType": changeBallType,
				"changeBallTrickLevel": changeBallTrickLevel,
				"sense": charaData.getSensePer(),
				"pageType": pageType
			};

			var point = this.getAsyncData('calcExpPoint', JSON.stringify(data)),
				total = point.reduce(function(pre, current){
					return pre + current;
				});
			for (var i = 0; i < point.length; i++) {
				$('.needExp td').eq(i).html(point[i]);
			}
			$('.needExp td').eq(5).html(total);




			//選手データ書き込み
			$('#entryNameCharaData').html($('input#charaName').val());
			$('#mainPositionCharaData').html($('#mainPosition option:selected').text());

			var array = charaData.getSubPosition(1),
				mainPosition = Number($('#mainPosition option:selected').val()),
				str = '';
			for (var i = 0; i < array.length; i++) {
				if (i !== mainPosition && array[i] !== null) {
					str += $('#mainPosition option').eq(i).text() + '，';
				}
			}
			str = str.substring(0, str.length - 1);
			$('#subPositionCharaData').html(str || '無し');
			$('#useHandCharaData').html($('#useHand option:selected').text());

			str = '';
			for (var i = 0; i < basePointAim.length; i++) {
				if (i === 0) {
					str += basePointAim[i] ? (IndividModule.getMakingType() === 1 ? basePointAim[i] + 'km/h ' : '<span class="dispAbArea"><img class="dispBaseAbT" src="../img/trajectory' + basePointAim[i] + '.png"></span>' ) : '-';
				} else {
					str += '<span class="dispAbArea"><img class="dispBaseAb" src="../img/rank' + commonModule.getRankString(basePointAim[i]) + '.png"><span class="dispAbNum">' + basePointAim[i] + '</span></span>';
				}
			}
			$('#baseAbilityCharaData').html(str);


			if(IndividModule.getMakingType() === 1) {
				str = '';
				for (var i = 0; i < changeBallAim.length; i++) {
					if(changeBallAim[i] > 0) {
						var obj = $('#tab2 .changeBallType').eq(i).find('option').eq(changeBallType[i]-1);
						var text = obj.text();
						if (i === 0) {
							str += text;
						} else {
							str += text + changeBallAim[i];
						}
						str += ',';
					}
				}
				str = str.substr(0, str.length-1);
				$('#changeBallCharaData').html(str);
			}


			str = '';

			var charaAbility = charaData.getAbilityList(1);

			for (var i = 0; i < abilityData.length; i++) {
				var ability = charaAbility[abilityData[i].id];
				if(ability !== null) {
					str += '<li class="' + abTypeClass[ability.type] + '">' + ability.name + '</li>';
				}
			}


			$('#abilityCharaData').html(str);

			if(IndividModule.getMakingType() === 0) {
				commonModule.updateAssessmentPoint();
			} else {
				commonModule.updateAssessmentPointPitcher();
			}

		},

		updateAssessmentPoint: function () {
			var chk = $('#nonAssessment').prop("checked");
			localStorage.setItem('nonAssessment', JSON.stringify(chk));

			if (chk) {
				$('#assessmentPointCharaData').html('');
				$('#assessmentPointMeter').val(0);
				return;
			}


			var obj = $('#tab2 .basePointInput'),
				basePoint = [];
			for (var i = 0; i < obj.length; i++) {
				basePoint[i] = Number(obj.eq(i).val());
			}

			var ability = charaData.getAbilityList(1).filter(function (elem){
				return elem !== null;
			}).map(function (elem){
				return elem.id;
			});

			var assessment = this.getAsyncData('getAssessmentPoint', JSON.stringify({"basePoint":basePoint, "ability":ability}));
			$('#assessmentPointCharaData').html(assessment.rank + '(' + assessment.point + ')');
			$('.meterGauge').css('width', (assessment.meter*10)+'%');

		},

		updateAssessmentPointPitcher: function() {
			var chk = $('#nonAssessment').prop("checked");
			localStorage.setItem('nonAssessment', JSON.stringify(chk));

			if (chk) {
				$('#assessmentPointCharaData').html('');
				return;
			}


			var obj = $('#tab1 .basePointInput'),
				baseNowPoint = [];
			for (var i = 0; i < obj.length; i++) {
				baseNowPoint[i] = Number(obj.eq(i).val());
			}

			var obj = $('#tab2 .basePointInput'),
				baseAimPoint = [];
			for (var i = 0; i < obj.length; i++) {
				baseAimPoint[i] = Number(obj.eq(i).val());
			}


			var changeBallType = [];
			var changeBallNow = [];
			var changeBallAim = [];
			obj = $('#tab2 .changeBallType');
			for (var i = 0; i < obj.length; i++) {
				changeBallType[i] = Number(obj.eq(i).val());
			}

			obj = $('#tab2 .changeBallInput');
			for (var i = 0; i < obj.length; i++) {
				changeBallNow[i] = Number($('#tab1 .changeBallInput').eq(i).val());
				changeBallAim[i] = Number(obj.eq(i).val());
			}

			var abilityNow = charaData.getAbilityList(0).filter(function (elem){
				return elem !== null;
			}).map(function (elem){
				return elem.id;
			});

			var abilityAim = charaData.getAbilityList(1).filter(function (elem){
				return elem !== null;
			}).map(function (elem){
				return elem.id;
			});

			var assessmentNow = this.getAsyncData('getAssessmentPointPitcher', JSON.stringify({"basePoint":baseNowPoint, "ability":abilityNow, "changeBallType":changeBallType, "changeBallValue":changeBallNow}));
			var assessmentAim = this.getAsyncData('getAssessmentPointPitcher', JSON.stringify({"basePoint":baseAimPoint, "ability":abilityAim, "changeBallType":changeBallType, "changeBallValue":changeBallAim}));
			var nowTotal = (assessmentNow.basePoint !== null ? assessmentNow.basePoint : 0) + assessmentNow.abPoint;
			var aimTotal = (assessmentAim.basePoint !== null ? assessmentAim.basePoint : 0) + assessmentAim.abPoint;
			$('#assessmentPointCharaData').html((assessmentNow.basePoint !== null ? parseInt(aimTotal) : '') + '(' + parseInt(aimTotal - nowTotal, 10) + '↑)');

		},

		isCatcher: function () {
			if(Number($('#mainPosition option:selected').val()) === 0 || charaData.getSubPosition(0, 0) !== null) {
				return true;
			}
			return false;
		},

		getRankString: function (val) {
			var rank = ['G', 'G', 'F', 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'S'];
			return val === 100 ? 'S' : rank[parseInt(val/10)];
		},

		saveCharaData: function(type) {
			commonModule.showBlockMessage('<div id="blockMsg"><i class="fa fa-spinner fa-pulse"></i> <span id="blockMessage">処理中...</span><div id="errorMsg"></div></div>');
			var post = {
				'name':$('#loginUserName').val(),
				'password':$('#loginPassword').val(),
				'charaId':$('#characterId').val(),
				'data':charaData.getSaveData(type)
			};

			commonModule.getAsyncData('registCharacter', JSON.stringify(post), function (res) {
				if(res.status !== -1) {
					var newUrl = setParameter({'userId':res.userId, charaId:res.charaId});
					$('#characterId').val(res.charaId);
					history.replaceState('','',newUrl);
					$('.shareLinkBody').html(window.location.href);
					commonModule.uploadImage(res.charaId, '<i class="fa fa-check" aria-hidden="true" style="color:#008000"></i>' + res.msg);
				} else {
					res.msg = '<i class="fa fa-times" aria-hidden="true" style="color:#ff0000"></i>' + res.msg;
					$('#blockMsg').html(res.msg);
					$('.blockOverlay').click($.unblockUI).on('click', $.unblockUI);
					setTimeout($.unblockUI, 2000);
				}
			}, function (res) {
				res.msg = '<i class="fa fa-times" aria-hidden="true" style="color:#ff0000"></i>エラーが発生しました。電波状態の良い所でやり直してください。';
				$('#blockMsg').html(res.msg);
				$('.blockOverlay').click($.unblockUI).on('click', $.unblockUI);
				setTimeout($.unblockUI, 2000);
			});

			//パラメータを設定したURLを返す
			function setParameter( paramsArray ) {
				var resurl = '';
				for (var key in paramsArray ) {
					resurl += (resurl.indexOf('?') == -1) ? '?':'&';
					resurl += key + '=' + paramsArray[key];
				}
				return resurl;
			}

		},

		GetQueryString: function() {
			var result = {};
			if( 1 < window.location.search.length )	{
				// 最初の1文字 (?記号) を除いた文字列を取得する
				var query = window.location.search.substring( 1 );

				// クエリの区切り記号 (&) で文字列を配列に分割する
				var parameters = query.split( '&' );

				for( var i = 0; i < parameters.length; i++ ) {
					// パラメータ名とパラメータ値に分割する
					var element = parameters[ i ].split( '=' );

					var paramName = decodeURIComponent( element[ 0 ] );
					var paramValue = decodeURIComponent( element[ 1 ] );

					// パラメータ名をキーとして連想配列に追加する
					result[ paramName ] = paramValue;
				}
			}
			return result;
		},

		uploadImage: function(charaId, successMsg) {
			var param = commonModule.GetQueryString();
			var fd = new FormData($('#sendForm').get(0));
			if ($("#sendFile").val().length === 0) {
				$('#blockMsg').html(successMsg);
				$('.blockOverlay').click($.unblockUI).on('click', $.unblockUI);
				setTimeout($.unblockUI, 2000);
				return false;
			}

			if (!param.charaId) {
				commonModule.showBlockMessage('<i class="fa fa-times" aria-hidden="true" style="color:#ff0000"></i>エラーが発生しました。');
				$('.blockOverlay').click($.unblockUI).on('click', $.unblockUI);
				setTimeout($.unblockUI, 3000);
				$('#faceLabel').append($("#sendForm").clone(true));
				$("#sendForm").remove();
				return false;
			}

			ga('send', 'event', 'action', 'click', 'uploadImage');
			fd.append('charaId', param.charaId || "");
			fd.append('userName', $('#loginUserName').val());
			fd.append('password', $('#loginPassword').val());
			$.ajax({
				url: "./uploadImage.php",
				type: "POST",
				data: fd,
				processData: false,
				contentType: false,
				dataType: 'json'
			}).done(function( data ) {
				switch(data.status) {
					case 0:
						$('#charaImg').attr('src', '../img/charaFace/' + data.dirName + '/' + data.charaId + '.jpg' + '?' + new Date().getTime());
						$('#blockMsg').html(successMsg);
						$('.blockOverlay').click($.unblockUI).on('click', $.unblockUI);
						setTimeout($.unblockUI, 2000);
						break;
					case -1:
						$('#blockMsg').html('<i class="fa fa-times" aria-hidden="true" style="color:#ff0000"></i>' + data.msg);
						$('.blockOverlay').click($.unblockUI).on('click', $.unblockUI);
						setTimeout($.unblockUI, 3000);
						break;
				}
			}).fail(function( res ) {
				alert('エラーが発生しました。');
			});
			return false;
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


		setPreviewImage: function(e) {
			var file = e.target.files[0],
			reader = new FileReader(),
			preview = $('#charaImg');
			if(file === void 0) {
				preview.attr('src', '../img/noface.jpg');
				return false;
			}

			if(!~file.type.indexOf('image')) {
				preview.attr('src', '../img/noface.jpg');
				alert('ファイル形式が不正です。');
				return false;
			}

			reader.onload = (function(file) {
				return function(e) {
					preview.attr('src', e.target.result);
				};
			})(file);
			reader.readAsDataURL(file);
		},


		saveAbilityTemplate: function () {
			//後で makingStr = IndividModule.getMakingStr()に変更
			var makingStr = (['batter', 'pitcher'])[IndividModule.getMakingType()];

			var ability = charaData.getAbilityList(0).map(function (el) {
				return el ? el.id : null;
			});

			localStorage.setItem(makingStr + 'AbilityTemplate', JSON.stringify(ability));
			$.remodal.lookup[$('[data-remodal-id=doneTemplateModal]').data('remodal')].open();
		},

		setAbilityTemplate: function () {
			//後で makingStr = IndividModule.getMakingStr()に変更
			var makingStr = (['batter', 'pitcher'])[IndividModule.getMakingType()];
			var template = localStorage.getItem(makingStr + 'AbilityTemplate');
			if (template === null) {
				alert('テンプレートが保存されていません');
				return;
			}

			template = [JSON.parse(template)];
			var count = charaData.getAbilityList(0).length;
			for (var i = 0; i < count; i++) {
				charaData.setAbilityList(0, i, null);
				charaData.setAbilityList(1, i, null);
			}

			var abData = commonModule.getAsyncData('convertSaveAbility', JSON.stringify({ability:template}));
			for (var i = 0; i < abData[0].length; i++) {
				charaData.setAbilityList(0, i, abData[0][i]);
				charaData.setAbilityList(1, i, abData[0][i]);
			}

			var ability = charaData.getAbilityList(0).map(function (el) {
				return el ? el.id : null;
			});
			if(commonModule.getTabType() !== 2) {
				commonModule.refreshDisplayAbility(commonModule.getTabType());
			}
			$.remodal.lookup[$('[data-remodal-id=optionModal]').data('remodal')].close();

		}

	};

})();

