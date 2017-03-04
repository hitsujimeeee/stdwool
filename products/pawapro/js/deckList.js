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
				str += '<a class="deckListLink" href="./deckCreator.php?userId=' + d.userId + '&deckId=' + d.id + '"><li class="deckList">' +
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
				str += '</div></li></a>';
			}
			$('#deckList').html(str);
		}).fail(function (res) {
		});
	},

};
