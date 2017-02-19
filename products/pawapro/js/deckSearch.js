/*jslint browser: true, jquery: true*/
/*jslint shadow:true*/

$(function() {
	var cond = sessionStorage.getItem('deckSearchCond');
	var searchDeata = sessionStorage.getItem('deckSearchData');

	if (cond) {
		cond = JSON.parse(cond);
		$('#deckName').val(cond.deckName);
		$('#targetType').val(cond.targetType);
		$('#school').val(cond.school);
		$('#evChara').val(cond.evChara);
		$('#authorName').val(cond.author);
		$('#twitterId').val(cond.twitterId);
		$('#sortOrder').val(cond.sortOrder);
		$('#sortDir').val(cond.sortDir);
		$('#favCheck').prop("checked", cond.favCheck);

	}

	if (searchDeata) {
		deckSearch.drawDeckList(JSON.parse(searchDeata));
	}

	$('#searchCond').on('hide', function() {
		$('#acordionHeader .closeIcon').removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
	});

});


var deckSearch = {

	getSearchData: function() {
		return {
			deckName: $('#deckName').val(),
			targetType: Number($('#targetType').val()),
			school: Number($('#school').val()),
			evChara: $('#evChara').val(),
			author:$('#authorName').val(),
			twitter:$('#twitterId').val(),
			sortOrder: $('#sortOrder').val(),
			sortDir: $('#sortDir').val(),
			favCheck: $('#favOnly').prop('checked')
		};
	},

	reset: function() {
		$('#deckName').val('');
		$('#targetType').val(0);
		$('#school').val(0);
		$('#evChara').prop('selectedIndex', 0);
		$('#authorName').val('');
		$('#twitterId').val('');
		$('#sortOrder').prop('selectedIndex', 0);
		$('#sortDir').prop('selectedIndex', 0);
		$('#favOnly').prop('checked', false);
		sessionStorage.removeItem('deckSearchCond');
		sessionStorage.removeItem('deckSearchData');
		document.querySelector('#deckList').innerHTML = '';
	},

	search: function() {
		var inputData = deckSearch.getSearchData();
		var sendData = inputData;
		sendData.userName = localStorage.getItem('userName');
		sendData.password = localStorage.getItem('password');
		$.blockUI({
			message: '<div><i class="fa fa-spinner fa-pulse fa-fw"></i>読み込み中……</div>',
			css:{'width':'80%'}
		});
		$.ajax({
			type: 'POST',
			url: './logic/search.php',
			timeout: 10000,
			data: sendData,
		}).done(function(data) {
			deckSearch.drawDeckList(data);
			sessionStorage.setItem('deckSearchData', JSON.stringify(data));
			inputData.favCheck = $('#favOnly').prop('checked');
			sessionStorage.setItem('deckSearchCond', JSON.stringify(inputData));
			$.unblockUI();

			// 移動先を数値で取得
			var position = $('#deckArea').offset().top;
			// スムーススクロール
			$('body,html').animate({scrollTop:position}, 400, 'swing');

		}).fail(function(res) {
			console.log(res);
			$.unblockUI();
		});
	},

	drawDeckList: function(data) {
		var str = '';
		var favList = localStorage.getItem('favoriteList');
		var favCheck = $('#favOnly').prop('checked');
		if(data.length === 0) {
			$('.noResult').removeClass('hiddenDisplay');
		} else {
			$('.noResult').addClass('hiddenDisplay');
		}

		if(favList) {
			favList = JSON.parse(favList);
		}
		for (var i = 0; i < data.length; i++) {
			var d = data[i];

			if (favCheck && favList && favList.length > 0 && favList.indexOf(d.id) < 0) {
				continue;
			}

			str += '<li class="deckList"><a href="./deckCreator.php?userId=' + d.userId + '&deckId=' + d.id + '">' +
				'<div class="deckHeader"><h3>' + d.name + '　</h3><p class="authorName">作者:' + d.author + (d.twitterId ? '(@' + d.twitterId + ')' : '' ) + '</p></div>' +
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
			str += '</div>';
			str += '<div class="deckOption">';
			str += '<span class="viewDeckType">' + d.targetType + '</span>';
			str += '<span class="viewSchoolType">' + d.school + '</span>';
			str += '</div>';
			str += '</a></li>';
		}
		var disp = document.querySelector('#deckList');
		disp.innerHTML = '';
		disp.insertAdjacentHTML('beforeend', str);


	}

};
