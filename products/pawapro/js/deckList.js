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
			for (var i = 0; i < data.length; i++) {
				var d = data[i];
				str += '<li class="deckList" onclick="deckList.sendEditPage(\'' + d.userId + '\', \'' + d.id + '\')">' +
					'<div class="deckHeader">' + d.name + '　</div>' +
					'<div class="deckDetail">';
				for (var j = 0; j < d.chara.length; j++) {
					str += '<img class="eveChara" src="../img/eventChara/' + (d.chara[j] ? d.chara[j] + '.jpg' : 'noimage.jpg') + '">';
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
				str += '</div></li>';
			}
			$('#deckList').html(str);
		}).fail(function (res) {
			console.log(res);
		});
	},

	sendEditPage: function (userId, id) {
		$('#userName').val($('#loginUserName').val());
		$('#password').val($('#loginPassword').val());
		$('#editForm').attr('action', './deckCreator.php?userId=' + userId + '&deckId=' + id).submit();
	},

	createNewDeck: function () {
		$('#userName').val($('#loginUserName').val());
		$('#password').val($('#loginPassword').val());
		$('#editForm').submit();
	}

};
