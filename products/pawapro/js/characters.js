/*jslint browser: true, jquery: true*/
/*jslint shadow:true*/

var deleteId = '';

$(function() {
	getCharacterList();

	$(document).on('confirmation', '#confirmModal', function () {
		doDeleteCharacter();
	});

});


function calcAssessmentPoint(chara) {

	var ability = chara.ability[1].filter(function (elem){
		return elem !== null;
	});
	return getAsyncData('getAssessmentPoint', JSON.stringify({"basePoint":chara.basePoint[1], "ability":ability}));

}

function getAsyncData(method, data, callBackSuccess, callBackError) {
	if (typeof(callBackSuccess) !== 'undefined') {
		$.ajax({
			type: "POST",
			url: method + '.php',
			data: data || {},
			success: callBackSuccess,
			error: callBackError
		});
		return null;
	}
	return data ? JSON.parse($.ajax({
		type: "POST",
		url: method + '.php',
		data: data || {},
		async: false
	}).responseText) : null;
}


function getCharacterList() {
	var data = {
		'name':$('#loginUserName').val(),
		'password':$('#loginPassword').val()
	};
	if(!data.name || !data.password){
		return;
	}

	$('#batterTable').append('<tr style="height:3em;"><td colspan="13" class="waitMessage"></td></tr>');
	$('#pitcherTable').append('<tr style="height:3em;"><td colspan="14" class="waitMessage"></td></tr>');

	$('.waitMessage').block({
		message: '読み込み中……',
	});



	getAsyncData('getCharacterList', JSON.stringify(data), function (res) {
		if (res.state == 1) {
			updateCharacterList(res.data);
		} else {
			showBlockMessage('<span style="color:#f00"><i class="fa fa-exclamation-triangle"></i>存在しないユーザー情報です。<br>ユーザー名、パスワードが間違っていないか確認してください。</span>');
			$('.blockOverlay').click($.unblockUI).on('click', $.unblockUI);
			setTimeout($.unblockUI, 2000);
			$('#batterTable').find("tr:gt(0)").remove();
			$('#pitcherTable').find("tr:gt(0)").remove();
		}
	}, function (res) {
//		alert(res);
	});
}

function updateCharacterList(data) {
	var posNameList = [
		['捕手', '一塁手', '二塁手', '三塁手', '遊撃手', '外野手'],
		['先発', '中継ぎ', '抑え']
	];

	$('#batterTable').find("tr:gt(0)").remove();
	for (var i = 0; i < data.charaList.length; i++) {
		var chara = data.charaList[i].data,
			imgURL = data.charaList[i].imgURL;
		if (chara.charaType === 0) {
			var target = $('#batterTable');
			var str = '<tr>' +
				'<td class="charaFaceCell"><a href="./batter.php?userId=' + data.userId + '&charaId=' + data.charaList[i].id + '"><img class="charaFace" src="' + imgURL + '"></a></td>' +
				'<td>' + escapeHtml(chara.name) + '</td>' +
				'<td>' + posNameList[0][chara.mainPosition] + '</td>';

				for (var j = 0; j < chara.basePoint[1].length; j++) {
					str += '<td>';
					if(chara.basePoint[1][j] !== 0) {
						str += '<img class="rankGraph" src="../img/';
						if(j === 0) {
							str+= 'trajectory' + chara.basePoint[1][j];
						} else {
							str+= 'rank' + getRankString(chara.basePoint[1][j]);
						}
						str += '.png">';
					}
					str += '</td>';
				}
				str += '<td>' + calcAssessmentPoint(chara).point + '</td>' +
				'<td><a href="./batter.php?userId=' + data.userId + '&charaId=' + data.charaList[i].id + '">編集</a></td>' +
				'<td><a href="javascript:deleteCharacter(\'' + data.charaList[i].id + '\')">削除</a></td>' +
				'</tr>';
			target.append(str);
		}
	}

	$('#pitcherTable').find("tr:gt(0)").remove();
	for (var i = 0; i < data.charaList.length; i++) {
		var chara = data.charaList[i].data,
			imgURL = data.charaList[i].imgURL;
		if (chara.charaType === 1) {
			var target = $('#pitcherTable');
			var str = '<tr>' +
				'<td class="charaFaceCell"><a href="./pitcher.php?userId=' + data.userId + '&charaId=' + data.charaList[i].id + '"><img class="charaFace" src="' + imgURL + '"></a></td>' +
				'<td>' + escapeHtml(chara.name) + '</td>' +
				'<td>' + posNameList[1][chara.mainPosition] + '</td>';
				for (var j = 0; j < chara.basePoint[1].length; j++) {
					str += '<td>';
					if(chara.basePoint[1][j] !== 0) {
						if(j === 0) {
							str+= '' + chara.basePoint[1][j];
						} else {
							str+= '<img class="rankGraph" src="../img/rank' + getRankString(chara.basePoint[1][j]) + '.png">';
						}
					}
					str += '</td>';
				}
				for (var j = 0; j < chara.changeBall[1].length; j++) {
					str += '<td>' + (chara.changeBall[1][j] ? chara.changeBall[1][j].value : '0') + '</td>';
				}
				str += '<td><a href="./pitcher.php?userId=' + data.userId + '&charaId=' + data.charaList[i].id + '">編集</a></td>' +
				'<td><a href="javascript:deleteCharacter(\'' + data.charaList[i].id + '\')">削除</a></td>' +
				'</tr>';
			target.append(str);
		}
	}



}

function escapeHtml(text) {
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};

	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function deleteCharacter(charaId) {
	$.remodal.lookup[$('[data-remodal-id=confirmModal]').data('remodal')].open();
	deleteId = charaId;
}

function doDeleteCharacter() {
	var data = {
		'name':$('#loginUserName').val(),
		'password':$('#loginPassword').val(),
		'charaId':deleteId
	};

	getAsyncData('deleteCharacter', JSON.stringify(data), function(res) {
		if(res.state !== -1) {
			res.msg = '<i class="fa fa-check fa-fw" aria-hidden="true" style="color:#008000"></i>' + res.msg;
			getCharacterList();
		} else {
			res.msg = '<i class="fa fa-times fa-fw" aria-hidden="true" style="color:#ff0000"></i>' + res.msg;
		}
		showBlockMessage(res.msg);
		$('.blockOverlay').click($.unblockUI).on('click', $.unblockUI);
		setTimeout($.unblockUI, 1500);
	}, function(res) {
//		alert(res);
	});
}

function getRankString(val) {
	var rank = ['G', 'G', 'F', 'F', 'E', 'D', 'C', 'B', 'A', 'S'];
	return val === 100 ? 'S' : rank[parseInt(val/10)];
}

function showBlockMessage(msg) {
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
}


