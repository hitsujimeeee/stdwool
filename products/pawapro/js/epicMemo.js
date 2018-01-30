/*jslint shadow:true, browser: true, jquery: true */

$(function () {

	$('.epicButton').on('click', epicMemo.openRemodal);
	$('.epicItem').on('click', epicMemo.setEpic);
	epicMemo.load();
});


var epicMemo = {
	selectedIndex: 0,
	classList: ['buttonType0', 'buttonType1', 'buttonType2', 'buttonType3', 'buttonType4', 'buttonType5'],

	openRemodal: function() {
		$.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')].open();
		epicMemo.selectedIndex = $('.epicButton').index(this);
	},

	closeRemodal: function() {
		$.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')].close();
	},

	setEpic: function() {
		epicMemo.closeRemodal();
		var idx = $('.epicItem').index(this);
		var name = $('.epicItem').eq(idx).html();
		var type = $('.epicItem').eq(idx).data('epictype');
		$('.epicButton').eq(epicMemo.selectedIndex).html(name).
			removeClass(epicMemo.classList.join(' ')).
			addClass('buttonType' + type);

		epicMemo.save();
	},

	addRow: function(saveFlag) {
		if ($('.epicTable tr').length > 20) {
			return;
		}

		var str = '<tr>' +
			'<th>' + $('.epicTable tr').length + '</th>' +
			'<td><button class="epicButton"></button></td>' +
			'</tr>';

		$('.epicTable').append(str);
		$('.epicButton').off().on('click', epicMemo.openRemodal);

		if (saveFlag) {
			epicMemo.save();
		}
	},

	deleteRow: function(saveFlag) {
		if ($('.epicTable tr').length <= 6) {
			return;
		}

		$('.epicTable tr:last').remove();
		if (saveFlag) {
			epicMemo.save();
		}

	},

	removeItem: function() {
		epicMemo.closeRemodal();
		$('.epicButton').eq(epicMemo.selectedIndex).html('').removeClass(epicMemo.classList.join(' '));
		epicMemo.save();
	},

	reset: function() {
		$('.epicButton').html('').removeClass(epicMemo.classList.join(' '));

		var restRowCount = $('.epicTable tr').length - 1 - 10;

		while(restRowCount > 0) {
			epicMemo.deleteRow(false);
			restRowCount--;
		}

		epicMemo.save();

	},

	load: function() {
		var dataStr = localStorage.getItem('epicMemo');
		if (!dataStr) {
			return;
		}
		var savedata = JSON.parse(dataStr);

		var restRowCount = savedata.rowCount - 10;

		while(restRowCount > 0) {
			epicMemo.addRow(false);
			restRowCount--;
		}

		var items = $('.epicItem');

		for (var i = 0; i < savedata.list.length; i++) {
			if (savedata.list[i] !== '') {

				var cType;
				for (var j = 0; j < items.length; j++) {
					if (items.eq(j).html() === savedata.list[i]) {
						cType = items.eq(j).data('epictype');
					}
				}
				$('.epicButton').eq(i).html(savedata.list[i]).addClass(epicMemo.classList[cType]);
			}
		}
	},

	save: function() {
		var rowCount = $('.epicTable tr').length - 1;
		var list = $('.epicButton').get().map(function(elt){
			return $(elt).html();
		});
		var savedata = {
			rowCount:rowCount,
			list: list
		};

		localStorage.setItem('epicMemo', JSON.stringify(savedata));
	}

};
