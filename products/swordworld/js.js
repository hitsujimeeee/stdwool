/*jslint browser: true*/
/*jslint plusplus: true */
/*global $, jQuery, console, MersenneTwister, alert*/

var CharaType = {
	list: [
		["人間", "[剣の加護／運命反転]"],
		["エルフ", "[暗視][剣の加護／優しき水]"],
		["ドワーフ", "[暗視][剣の加護／炎身]"],
		["タビット", "[第六感]"],
		["ルーンフォーク", "[暗視][HP変換]"],
		["ナイトメア", "[異貌][弱点]"],
		["シャドウ", "[暗視][月光の守り]"]
	],

	get: function (key) {
		"use strict";
		var i;
		if (typeof key === "number") {
			return this.list[key];
		}

		for (i = 0; i < this.list.length; i++) {
			if (this.list[i][0] === key) {
				return this.list[i];
			}
		}
		return null;
	}
};


var Carrer = {
	list: [],
	loadCarrerList: function () {
		"use strict";
		$.ajax({
			url: 'data/carrer.csv',
			success: function (data) {
				var i,
					line;
				Carrer.list = data.split(/\r\n|\r|\n/);
				Carrer.list.shift();
				Carrer.list.pop();
				for (i = 0; i < Carrer.list.length; i++) {
					line = Carrer.list[i].split(',');
					Carrer.list[i] = {
						id: line[0],
						type: line[1],
						name: line[2],
						skill: line[3],
						tech: line[4],
						physical: line[5],
						mental: line[6],
						exp: line[7]
					};
				}
			}
		});
	},

	getCarrer: function (charaType, carrerType) {
		"use strict";
		var i,
			carrer;
		for (i = 0; i < this.list.length; i++) {
			carrer = this.list[i];
			if (carrer.type === charaType && carrer.name === carrerType) {
				return carrer;
			}
		}
		return null;
	}
};

var Skill = {
	list: [],
	loadList: function () {
		"use strict";
		$.ajax({
			url: 'data/skill.csv',
			async: false,
			success: function (data) {
				var i;
				Skill.list = data.split(/\r\n|\r|\n/);
				Skill.list.shift();
				Skill.list.pop();
				for (i = 0; i < Skill.list.length; i++) {
					Skill.list[i] = Skill.list[i].split(',');
				}
			}
		});
	},

	getSkill: function (id) {
		"use strict";
		var i;
		if (typeof id === "number") {
			return this.list[id];
		}

		for (i = 0; i < this.list.length; i++) {
			if (this.list[i][1] === id) {
				return this.list[i];
			}
		}
		return null;
	}

};

var Language = {
	list: ["エルフ語", "巨人語", "交易共通語", "シャドウ語", "神紀文明語", "地方語(任意)", "ドラゴン語", "ドレイク語",
		  "ドワーフ語", "汎用蛮族語", "魔神語", "魔動機文明語", "魔法文明語", "妖精語", "妖魔語", "各種族語"],

	makeLanguageListTable: function (count) {
		"use strict";
		var i,
			str = '';
		for (i = 0; i < count; i++) {
			str += '<tr>' +
				'<td>' +
				this.getLanguageSelectDOMString() +
				'</td>' +
				'<td>' +
				'<input type="checkbox" class="skillLevel" data-mini="true">' +
				'</td>' +
				'<td>' +
				'<input type="checkbox" class="skillLevel" data-mini="true">' +
				'</td>' +
				'</tr>';
		}
		return str;
	},

	getLanguageSelectDOMString: function () {
		"use strict";
		var str = '',
			i,
			lang;
		str += '<select class="skillList">';
		str += '<option>言語選択</option>';
		for (i = 0; i < this.list.length; i++) {
			lang = this.list[i];
			str += '<option value="' + lang + '">' + lang + '</option>';
		}
		str += '/<select>';
		return str;
	}
};

var CombatFeats = {
	list: [],
	load: function () {
		"use strict";
		$.ajax({
			url: 'data/combatFeats.csv',
			async: false,
			success: function (data) {
				var i,
					line;
				CombatFeats.list = data.split(/\r\n|\r|\n/);
				CombatFeats.list.shift();
				CombatFeats.list.pop();
				for (i = 0; i < CombatFeats.list.length; i++) {
					line = CombatFeats.list[i].split(',');
					CombatFeats.list[i] = {
						id: line[0],
						name: line[1],
						cond: line[2],
						use: line[3],
						summary: line[4],
						discript: line[5]
					};
				}
			}
		});
	},
	
	getTableRowDOMString: function (count) {
		'use strict';
		var str = '',
			i,
			j,
			name;
		for (i = 0; i < count; i++) {
			str += '<tr class="' + (i === 0 ? 'show' : 'hide') + 'Col">' +
				'<td style="min-width:220px;">' +
				'<select style="text-align:left;" name="combatFetasSelect" onchange="CombatFeats.changeCombatFeats()">' +
				'<option>戦闘特技選択</option>';
			for (j = 0; j < this.list.length; j++) {
				name = this.list[j].name;
				str += '<option value=' + name + '>' + name + '</option>';
			}
			str += '</select>' +
				'</td>' +
				'</tr>';
		}
		return str;
	},

	
	changeCombatFeats: function () {
		'use strict';
		var selectObjs = $('select[name=combatFetasSelect]'),
			trs = $('#combatFeatsTable tr'),
			obj,
			useCount = 0,
			showCount = 0,
			i;
		for (i = 0; i < selectObjs.length; i++) {
			obj = selectObjs.eq(i);
			if (obj.prop('selectedIndex') === 0) {
				trs.eq(i).removeClass('showCol').addClass('hideCol');
			} else {
				useCount++;
			}
			if (trs.eq(i).hasClass('showCol')) {
				showCount++;
			}
		}
		
		if (useCount < 10 && useCount === showCount) {
			for (i = 0; i < selectObjs.length; i++) {
				if (trs.eq(i).hasClass('hideCol')) {
					trs.eq(showCount).removeClass('hideCol').addClass('showCol');
					break;
				}
			}
			
		}
	}
	
};

var Dice = {
	list: [
        ['2d', '2d', '2d', '2d', '2d', '2d'],
        ['2d', '2d', '1d', '2d', '2d', '2d'],
        ['2d+6', '1d', '2d', '2d', '1d', '2d+6'],
        ['1d', '1d', '1d', '2d', '2d+6', '2d'],
        ['2d', '1d', '2d', '2d', '2d', '1d'],
        ['2d', '2d', '1d', '1d', '2d', '2d'],
        ['1d', '1d', '2d', '2d', '2d', '2d']
    ]
};


Skill.loadList();
CombatFeats.load();

$(function () {
	"use strict";
	Carrer.loadCarrerList();
});


var Util = {
	changeCharaType: function (obj) {
		"use strict";
		var selectedType = $(obj).val(),
			selectObj = $('#carrer'),
			carrer,
			dices = $('select[name=dice]'),
			i,
			selectedIndex = $(obj).prop('selectedIndex');

		//全消去
		selectObj.find('option').remove();

		$('<option>').text('生まれ選択').appendTo(selectObj);

		for (i = 0; i < Carrer.list.length; i++) {
			carrer = Carrer.list[i];
			if (carrer.type === selectedType) {
				$('<option>').val(carrer.name).text(carrer.name).appendTo(selectObj);
			}
		}
		selectObj.selectmenu('refresh');
		$('#baseTech').html('　');
		$('#basePhysical').html('　');
		$('#baseMental').html('　');

		//ダイスリセット
		for (i = 0; i < dices.length; i++) {
			dices.eq(i).find('option').eq(0).html(Dice.list[selectedIndex - 1][i]);
			dices.eq(i).prop('selectedIndex', 0);
			dices.eq(i).selectmenu('refresh');
		}

		//種族特徴設定
		$('#characteristic').html(CharaType.get(selectedType)[1]);
		this.changeCarrer();
	},



	//魔法使い系技能のレベルの合計取得
	getMagicSkillTotalLevel: function () {
		'use strict';
		var skillObjs = $('select.skillList'),
			levelObjs = $('input.skillLevel'),
			skObj,
			lvObj,
			skill,
			level,
			i,
			j,
			total = 0;

		for (i = 0; i < skillObjs.length; i++) {
			skObj = skillObjs.eq(i);
			level = Number(levelObjs.eq(i).val());
			if (skObj.prop('selectedIndex') !== 0 && level > 0) {
				skill = Skill.getSkill(skObj.val());
				if (Number(skill[2]) === 1) {
					total += level;
				}
			}
		}
		return total;
	},

	//冒険者レベルを取得する
	getPlayerLevel: function () {
		'use strict';
		var skillObjs = $('select.skillList'),
			levelObjs = $('input.skillLevel'),
			skObj,
			lvObj,
			level,
			i,
			j,
			max = 0;

		for (i = 0; i < skillObjs.length; i++) {
			skObj = skillObjs.eq(i);
			level = Number(levelObjs.eq(i).val());
			if (skObj.prop('selectedIndex') !== 0 && level > max) {
				max = level;
			}
		}
		return max;

	},


	//LvやHP,MPなどのステータス設定
	setSpecialStatus: function (maxLv) {
		"use strict";
		var lifePoint = Number($('span[name=statusPoint]').eq(3).text()),
			mentalPoint = Number($('span[name=statusPoint]').eq(5).text());
		if (!maxLv) {
			maxLv = this.getPlayerLevel();
		}
		$('#lvForm').html(maxLv);
		$('#hpForm').html(maxLv * 3 + lifePoint);
		$('#mpForm').html(this.getMagicSkillTotalLevel() * 3 + mentalPoint);
		$('#lifeForm').html(maxLv + parseInt(lifePoint / 6, 10));
		$('#mentalForm').html(maxLv + parseInt(mentalPoint / 6, 10));
	},

	setStatus: function () {
		"use strict";
		var basePoint = [
            Number($('#baseTech').html()) || 0,
            Number($('#basePhysical').html()) || 0,
            Number($('#baseMental').html()) || 0
        ],
			dices = $('select[name=dice]'),
			statusArea = $('span[name=statusPoint]'),
			bonusArea = $('span[name=statusBonus]'),
			i,
			value;

		for (i = 0; i < statusArea.length; i++) {
			value = basePoint[parseInt(i / 2, 10)] + (Number(dices.eq(i).val()) || 0);
			statusArea.eq(i).html(value);
			bonusArea.eq(i).html(parseInt(value / 6, 10));
		}
		this.setSpecialStatus();

	},


	changeCarrer: function (obj) {
		"use strict";
		var i,
			j,
			carrer,
			charaType = $('#charaType').val(),
			selectObj,
			skill,
			skillTypes,
			selectedCarrer,
			defSkillCount = 0;

		selectedCarrer = obj ? $(obj).val() : $('#carrer').val();

		//技、体、心　値更新
		carrer = Carrer.getCarrer(charaType, selectedCarrer);
		if (carrer) {
			$('#baseTech').html(carrer.tech);
			$('#basePhysical').html(carrer.physical);
			$('#baseMental').html(carrer.mental);
		}

		//ステータス表更新
		this.setStatus();

		//初期所有技能リスト変更
		selectObj = $('#defaultSkillTable').find('select');

		//全消去
		selectObj.find('option').remove();

		$('<option>').text('技能選択').appendTo(selectObj);

		for (i = 0; i < Carrer.list.length; i++) {
			carrer = Carrer.list[i];
			if (carrer.type === charaType && carrer.name === selectedCarrer) {
				skillTypes = carrer.skill;
				break;
			}
		}

		if (skillTypes) {
			skillTypes = skillTypes.split(':');
			for (i = 0; i < Skill.list.length; i++) {
				skill = Skill.list[i];
				for (j = 0; j < skillTypes.length; j++) {
					if (skill[0] === skillTypes[j]) {
						$('<option>').val(skill[1]).text(skill[1]).appendTo(selectObj);
						defSkillCount++;
					}
				}
			}
		}

		if (defSkillCount > 0) {
			selectObj.prop('selectedIndex', 1);
		}

		selectObj.selectmenu('refresh');


		//経験値変更
		$('#restExp').html(carrer.exp);
	},




	setRandomDice: function () {
		"use strict";
		var i,
			j,
			dices = $('select[name=dice]'),
			dice,
			mt = new MersenneTwister(),
			type,
			val,
			count;
		for (i = 0; i < dices.length; i++) {
			dice = dices.eq(i);
			type = dice.find('option').eq(0).text();
			val = 0;
			if (/^\dd/.test(type)) {
				count = Number(type.match(/^\dd/)[0].replace(/\D/g, ''));
				for (j = 0; j < count; j++) {
					val += mt.nextInt(6) + 1;
				}
			}
			if (/\+\d$/.test(type)) {
				val += Number(type.match(/\+\d$/)[0].replace(/\D/g, ''));
			}

			dice.val(val);
			dice.selectmenu('refresh');
		}
		this.setStatus();
	},



	getDiceNumberListString: function () {
		"use strict";
		var str = '',
			i,
			NUMBER_COUNT = 18;
		for (i = 0; i < NUMBER_COUNT; i++) {
			str += '<option value="' + (i + 1) + '">' + (i + 1) + '</option>';
		}
		return str;
	},



	getSkillListString: function (defFlag) {
		"use strict";
		var str = '',
			skill,
			i;
		str += '<select class="skillList" onchange="Util.changeSkillList()">';
		str += '<option>技能選択</option>';
		if (!defFlag) {
			for (i = 0; i < Skill.list.length; i++) {
				skill = Skill.list[i];
				str += '<option value="' + skill[1] + '">' + skill[1] + '</option>';
			}
		}
		str += '/<select>';
		return str;
	},

	makeSkillListTable: function (count, defFlag) {
		"use strict";
		var i,
			str = '';
		for (i = 0; i < count; i++) {
			str += '<tr>' +
				'<td>' +
				this.getSkillListString(defFlag) +
				'</td>' +
				'<td>' +
				'<input type="text" class="skillLevel" data-mini="true" style="width:40px;" onchange="Util.changeSkillList()">' +
				'</td>' +
				'</tr>';
		}
		return str;

	},

	changeSkillList: function () {
		"use strict";
		var pointTable = [
			[1000, 1000, 1500, 1500, 2000, 2500],
			[500, 1000, 1000, 1500, 1500, 2000]
		],
			skillObjs = $('select.skillList'),
			levelObjs = $('input.skillLevel'),
			skObj,
			lvObj,
			skill,
			level,
			i,
			j,
			total = 0,
			carrer,
			nowExp = 0,
			maxLv = 0;

		for (i = 0; i < skillObjs.length; i++) {
			skObj = skillObjs.eq(i);
			level = Number(levelObjs.eq(i).val());
			if (skObj.prop('selectedIndex') !== 0 && level > 0) {
				skill = Skill.getSkill(skObj.val());
				for (j = 0; j < level - (i === 0 ? 1 : 0); j++) {
					total += pointTable[skill[3] === 'A' ? 0 : 1][j];
				}
				if (maxLv > level) {
					maxLv = level;
				}
			}
		}
		carrer = Carrer.getCarrer($('#charaType').val(), $('#carrer').val());
		if (carrer) {
			nowExp = Number(carrer.exp);
		}
		$('#restExp').html(nowExp - total);
		this.setSpecialStatus(maxLv);
	}
};