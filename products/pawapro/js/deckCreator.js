/*jslint browser: true, jquery: true */
/* global savedCharaList */
/*jslint shadow:true*/

$(function () {
	$('#ui-tab').tabs();

	$(document).on('confirmation', '#eveCharaRemodal', function () {
		deckCreator.ConfirmRemodal();
		console.log();
	}).on('closeOnOutsideClick', '#eveCharaRemodal', function () {
		deckCreator.ConfirmRemodal();
		console.log();
	});

	$('.charaLv').on('change', function () {
		var idx = $('.charaLv').index(this);
		if (idx < deckCreator.selectedCharaList.length) {
			deckCreator.selectedCharaList[idx].lv = Number(this.value);
		}
	});

	$('.rareRank').on('change', function () {
		var idx = $('.rareRank').index(this);
		if (idx < deckCreator.selectedCharaList.length) {
			deckCreator.selectedCharaList[idx].rare = Number(this.value);
		}
	});

	$('.eveCharaListItem').click(deckCreator.clickEveCharaList);

	var setRestTextCount = function () {
		if (!$('#summary').length) {
			return;
		}
		var count = $('#summary').val().length;
		$('#restTextCount').text(500 - count);
	};

	$('#summary').on('keydown', setRestTextCount);
	$('#summary').on('change', setRestTextCount);

	setRestTextCount();
	deckCreator.init();

	//選択済みのイベキャラの得意練習画像を画面に反映
	(function(){
		var list = deckCreator.selectedCharaList;
		var evTypeStr = ['Before', 'After'];
		for (var i = 0; i < list.length; i++) {
			if (list[i]) {
				var obj = $('.eveCharaListItem').filter(function() {
					return list[i].id ===  '' + $(this).data('charaId');
				});
				var trainingType = obj.data('trainingType');
				var eventType = Number(obj.data('eventType'));
				if (trainingType) {
					$('.eveImageArea img.trainingIcon').eq(i).removeClass('hiddenDisplay').attr('src', '../img/practice' + trainingType + '.jpg');
				}
				$('.charaLv').eq(i).addClass('colorEventType' + evTypeStr[eventType]);
				$('.rareRank').eq(i).addClass('colorEventType' + evTypeStr[eventType]);
			}
		}

	})();

	var userName = localStorage.getItem('userName');
	var password = localStorage.getItem('password');

	$('#userName').val(userName);
	$('#password').val(password);



	$.ajax({
		url:'./logic/getFavoriteList.php',
		type:'POST',
		data:{
			userName: userName,
			password: password
		}
	}).done(function(res) {
		var list = localStorage.getItem('favoriteList');
		list = list ? JSON.parse(list) : [];
		if(res) {
			list = list.concat(res);
		}
		if(list.indexOf($('#deckId').val()) >= 0) {
			$('#favButton').attr('disabled', true).html('お気に入り済み');
		}
	}).fail(function(res) {
		console.log(res);
	});

});


var deckCreator = {
	selectedCharaList: [],

	init: function () {
		for (var i = 0; i < savedCharaList.length; i++) {
			deckCreator.selectedCharaList[i] = savedCharaList[i];
		}
	},

	openRemodal: function () {
		$.remodal.lookup[$('[data-remodal-id=eveCharaRemodal]').data('remodal')].open();
	},

	ConfirmRemodal: function () {
		deckCreator.updateEveCharaList();
		$.remodal.lookup[$('[data-remodal-id=eveCharaRemodal]').data('remodal')].close();
	},

	updateEveCharaList : function() {
		var list = deckCreator.selectedCharaList;
		var f1 = function(){
			return list[i].id ===  '' + $(this).data('charaId');
		};
		var evTypeStr = ['colorEventTypeBefore', 'colorEventTypeAfter'];

		$('.charaLv, .rareRank').removeClass(evTypeStr.join(' '));

		for (var i = 0; i < 6; i++) {
			var src = '../img/eventChara/';
			if (i <= list.length - 1) {
				src += list[i].id + '.jpg';
				var obj = $('.eveCharaListItem').filter(f1);
				var trainingType = obj.data('trainingType');
				var eventType = Number(obj.data('eventType'));
				if (trainingType !== "") {
					$('.eveImageArea img.trainingIcon').eq(i).removeClass('hiddenDisplay').attr('src', '../img/practice' + trainingType + '.jpg');
				}
				$('.charaLv').eq(i).val(list[i].lv).attr('disabled', false).addClass(evTypeStr[eventType]);
				$('.rareRank').eq(i).val(list[i].rare).attr('disabled', false).addClass(evTypeStr[eventType]);

			} else {
				src += 'noimage.jpg';
				$('.eveImageArea img.trainingIcon').eq(i).addClass('hiddenDisplay').attr('src', '');
				$('.charaLv').eq(i).val('').attr('disabled', true);
				$('.rareRank').eq(i).val(0).attr('disabled', true);
			}

			$('.eveCharaImg .eveImageArea').eq(i).find('>img').attr('src', src);
		}
	},


	sortEveCharaList: function () {
		var orderList = ['charaId', 'charaRead', 'trainingType'];
		var order = orderList[+$('#sortOrderType').val()];
		var dir = +$('#sortOrderDir').val();
		var limitType = +$('#limitType').val();
		var tag = 'hiddenDisplay';
		var type;
		var items = $('.eveCharaListItem');
		items.sort(function (a, b) {
			var aVal = '' + $(a).data(order);
			var bVal = '' + $(b).data(order);

			if (aVal === bVal) {
				if('' + $(a).data('charaId') > '' + $(b).data('charaId')) {
					if (dir === 0) {
						return 1;
					} else {
						return -1;
					}
				} else {
					if (dir === 0) {
						return -1;
					} else {
						return 1;
					}
				}
			}

			if(dir === 0) {
				if (aVal === '') {
					return 1;
				}
				if (bVal === '') {
					return -1;
				}
				if(aVal > bVal) {
					return 1;
				} else {
					return -1;
				}
			} else {
				if (aVal === '') {
					return -1;
				}
				if (bVal === '') {
					return 1;
				}				if(aVal < bVal) {
					return 1;
				} else {
					return -1;
				}
			}

			return dir === 0 ? aVal >= bVal : bVal >= aVal;
		});


		$('#eveCharaList').html(items);
		$('.eveCharaListItem').click(deckCreator.clickEveCharaList);

		var obj = $('.eveCharaListItem');
		if (limitType === 0) {
			obj.removeClass(tag);
		} else {
			for (var i = 0; i < obj.length; i++) {
				var o = obj.eq(i);
				switch (limitType) {
					case 1:
						type = ""+o.data('charaType');
						if (type.length > 1 && type.split("").indexOf("0") === -1) {
							o.addClass(tag);
						} else if (+type.length === 1 && +type !== 0) {
							o.addClass(tag);
						} else {
							o.removeClass(tag);
						}
						break;
					case 2:
						type = ""+o.data('charaType');
						if (type.length > 1 && type.split("").indexOf("1") === -1) {
							o.addClass(tag);
						} else if (+type.length === 1 && +type !== 1) {
							o.addClass(tag);
						} else {
							o.removeClass(tag);
						}
						break;
					case 3:
						if (+o.data('charaType') !== 2) {
							o.addClass(tag);
						} else {
							o.removeClass(tag);
						}
						break;
					case 4:
						if (+o.data('eventType') !== 0) {
							o.addClass(tag);
						} else {
							o.removeClass(tag);
						}
						break;
					case 5:
						if (+o.data('eventType') !== 1) {
							o.addClass(tag);
						} else {
							o.removeClass(tag);
						}
						break;
				}
			}
		}
	},

	save: function () {
		var deckData = {};
		deckData.name = $('#deckName').val();
		deckData.chara = [];

		for (var i = 0; i < 6; i++) {
			if (deckCreator.selectedCharaList.length > i) {
				deckData.chara[i] = deckCreator.selectedCharaList[i];
			} else {
				deckData.chara[i] = null;
			}
		}

		deckData.type = $('#charaType').val();
		deckData.school = $('#school').val();
		deckData.summary = $('#summary').val();
		deckData.author = $('#author').val();
		deckData.gameId = $('#gameId').val();
		deckData.twitterId = $('#twitterId').val();

		$.ajax({
			url: '../php/logic/saveDeck.php',
			type: 'POST',
			data: {
				userName: $('#loginUserName').val(),
				password: $('#loginPassword').val(),
				deckId: $('#deckId').val(),
				deckData: deckData
			}
		}).done(function (res) {
			alert(res.msg);
			$('#deckId').val(res.deckId);
			var newUrl = deckCreator.setParameter({'userId':res.userId, 'deckId':res.deckId});
			history.replaceState('','',newUrl);

		}).fail(function (res) {
			alert('保存に失敗しました');
		});

	},

	setFavarite: function () {

		localStorage.setItem('userName', $('#userName').val());
		localStorage.setItem('password', $('#password').val());

		$.ajax({
			url: '../php/logic/setFavorite.php',
			type: 'POST',
			data: {
				userName: $('#userName').val(),
				password: $('#password').val(),
				deckUserId: $('#userId').val(),
				deckId: $('#deckId').val()
			}
		}).done(function (res) {
			console.log(res);
			var listStr = localStorage.getItem('favoriteList');
			var list = listStr ? JSON.parse(listStr) : [];
			switch(res.status) {
				case 0:	//既にお気に入り済み
				case 1: //登録成功
					var deckId = $('#deckId').val();
					if (list.indexOf(deckId) == -1) {
						list.push(deckId);
					}
					localStorage.setItem('favoriteList', JSON.stringify(list));
					$('#favButton').attr('disabled', true).text('お気に入り済み');
					alert(res.msg);
					break;
				case -1: //エラー失敗
					alert('失敗しました');
					break;
			}
		}).fail(function (res) {
			console.log(res);
		});


	},

	//パラメータを設定したURLを返す
	setParameter: function ( paramsArray ) {
		var resurl = '';
		for (var key in paramsArray ) {
			resurl += (resurl.indexOf('?') == -1) ? '?':'&';
			resurl += key + '=' + paramsArray[key];
		}
		return resurl;
	},

	clickEveCharaList: function(){
		var charaId = '' + $(this).data('charaId');
		var idList = deckCreator.selectedCharaList.map(function (el) {
			return el.id;
		});
		if (idList.indexOf(charaId) >= 0) {
			deckCreator.selectedCharaList.splice(idList.indexOf(charaId), 1);
			$(this).find('.evecharaIcon').removeClass('selectedItem');
		} else {
			if (deckCreator.selectedCharaList.length < 6) {
				deckCreator.selectedCharaList.push({
					id: charaId,
					lv: '',
					rare: 0
				});
				$(this).find('.evecharaIcon').addClass('selectedItem');
			}
		}
	},

	deleteSelectedEveChara: function(idx) {
		if (!deckCreator.selectedCharaList[idx]) {
			deckCreator.openRemodal();
			return;
		}

		var id = deckCreator.selectedCharaList[idx].id;
		var obj = $('#eveCharaList li');
		obj.each(function(){
			if ('' + $(this).data('charaId') === id) {
				$(this).find('.selectedItem').removeClass('selectedItem');
			}
		});

		deckCreator.selectedCharaList.splice(idx, 1);
		deckCreator.updateEveCharaList();
	}



};
