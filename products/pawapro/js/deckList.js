/*jslint browser: true, jquery: true */
/*jslint shadow:true*/

$(function () {
	deckList.loadDeckList();
});


var deckList = {

	loadDeckList: function () {
		$.ajax({
			type: 'POST',
			url: './logic/getDeckList.php',
			data: {
				'userName': $('#loginUserName').val(),
				'password': $('#loginPassword').val()
			}
		}).done(function (data) {
			var str = '';
			var rateGraphList = ['SR', 'SR', 'SR', 'R', 'R'];
			for (var i = 0; i < data.length; i++) {
				var d = data[i];
				str += '<li class="deckList" onclick="deckList.sendEditPage(\'' + d.userId + '\', \'' + d.id + '\')">' +
					'<div class="deckHeader">' + d.name + '　</div>' +
					'<div class="deckDetail">';
				for (var j = 0; j < d.chara.length; j++) {
					str += '<img onerror="this.src=\'../img/noface.jpg\';" class="eveChara" src="../img/eventChara/' + (d.chara[j] ? rateGraphList[d.rare[j]] + '/' + d.chara[j] + '.jpg' : 'noimage.jpg') + '">';
				}
				str += '</div>' +
					'<div class="deckTraining">';
				for (var j = 0; j < 10; j++) {
					str += '<div class="trainingCell"><img class="trainingIcon' + (d.training[j] > 0 ? ' nonOpacity' : '') + '" src="../img/practice' + j + '.jpg">';
					if (d.training[j] > 1) {
						str += '<div class="countNum">×' + d.training[j] + '</div>';
					}
					str += '</div>';
				}

				str += '</div>';
				str += '<div class="deckOption">';
				str += '<span class="viewDeckType">' + d.targetType + '</span>';
				str += '<span class="viewSchoolType">' + d.school + '</span>';
				str += Number(d.favCount) > 0 ? '<span class="viewFavCount"><i class="fa fa-heart"></i>' + d.favCount + '</span>' : '';
				str += '</div></li>';
			}
			$('#deckList').html(str);
		}).fail(function (res) {
		});
	},

	sendEditPage: function (userId, id) {
		$('#userName').val($('#loginUserName').val());
		$('#password').val($('#loginPassword').val());

		var validate = deckList.validateInput();
		if (validate) {
			alert(validate);
			return;
		}
		$('#editForm').attr('action', './deckCreator.php?userId=' + userId + '&deckId=' + id).submit();
	},

	createNewDeck: function () {
		$('#userName').val($('#loginUserName').val());
		$('#password').val($('#loginPassword').val());
		var validate = deckList.validateInput();
		if (validate) {
			alert(validate);
			return;
		}

		$('#editForm').submit();
	},

	validateInput: function() {
		var validateItem = ['userName', 'password'];
		for(var i = 0; i < validateItem.length; i++) {
			var item = $('#' + validateItem[i]);
			var max = Number(item.attr('maxlength'));
			var min = Number(item.attr('minlength'));
			var v = item.val();
			if(item.attr('required') != null && v === '') {
				return item.data('formName') + 'を入力してください。';
			}
			if (v !== '' && (v.length > max || v.length < min)) {
				return item.data('formName') + 'は' + (min ? min + '文字以上' : '') + max + '文字以内にしてください。';
			}
		}
		return null;

	},

};
