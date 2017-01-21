CREATE TABLE M_COMBAT_FEATS (
	ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	NAME VARCHAR(32),
	COND VARCHAR(64),
	USE_SKILL VARCHAR(32),
	SUMMARY VARCHAR(64),
	DETAIL VARCHAR(256)
);


INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('回避行動','冒険者レベル３以上','','ステップなどで、攻撃を回避しやすくします。','常に回避力を＋１します。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('頑強','ファイターもしくはグラップラー技能レベル５以上','','心身を鍛え、ダメージに耐え抜きます。','最大ＨＰが１５点上昇します。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('精密射撃','なし','','対象を狙い撃ち、確実に対象に攻撃を命中させます。','乱戦エリアに飛び道具を打ち込んでも誤射しなくなります。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('双撃','≪両手利き≫','','２体の敵を同時に攻撃します。　','※');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('狙撃','なし','','敵の急所を狙い撃つ、一撃必殺の射撃を試みます。','');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('鷹の目','≪精密射撃≫もしくは≪魔法誘導≫','','獲物を確実に捕らえる鷹のように、対象を狙えます。','完全に視界を塞がない森などの遮蔽や、乱戦エリア越しに射撃攻撃や魔法の行使ができます。また、全身を隠せない障害物に潜む対象や生け垣などの遮蔽物越しにもそれらを行えます。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('追加攻撃','グラップラー技能習得','グラップラー技能','攻撃の際、同じ対象にもう一度攻撃を行えます。','');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('鉄壁','≪かばう≫','','より多くのキャラクターをかばえるようになります。','');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('投げ強化','冒険者レベル３以上、≪投げ攻撃≫','グラップラー技能','投げの技術を高めます。','戦闘特技≪投げ攻撃≫の威力を増し、効果を高めます。四足獣もしくは脚８本以下の、部位が二つまでのキャラクターを投げられるようになり、武器<投げ>の威力が２０になります。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('二刀流','冒険者レベル５以上、≪両手利き≫','','両手に持った武器を、自在に使いこなせます。','片手武器を両手に持ち、それぞれの武器で同じ対象を攻撃した場合の、命中力判定のペナルティ修正がなくなります。<br>扱える武器は、必要筋力１５以下のものに限られます。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('武器習熟／＊＊','なし','','その武器についての知識や練度を高めます。','　＊＊には武器のカテゴリを一つ選んで記入し、習熟します（ソード、アックスなど）。そのカテゴリの武器を使用した場合、常にダメージ＋１点します。さらに、その武器カテゴリのＡランク装備が扱えるようになります。<br>　武器カテゴリの選択は自由で、カテゴリ別に習得できます。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('武器習熟Ⅱ／＊＊','冒険者レベル５以上、≪武器習熟≫／＊＊≪同じカテゴリ≫','','その武器について、さらなる知識や練度を高めます。','　＊＊のカテゴリの武器を使用した場合、常にダメージ＋２点します（合計で＋３点）。さらに、その武器カテゴリのＳランク装備が扱えるようになります。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('踏みつけ','冒険者レベル５以上、≪投げ攻撃≫','グラップラー技能','投げた後、足によってさらに攻撃を行います。','');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('ブロッキング','冒険者レベル３以上','','自分一人で多数のキャラクターを引き受け、乱戦に巻き込めるようになります。','');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('防具習熟／＊＊','なし','','その防具についての知識や練度を高めます。','　＊＊には防具のカテゴリを一つ選んで記入し、習熟します（金属鎧、非金属鎧、盾のどれか）。そのカテゴリの防具を使用している場合、常に防護点を＋１点します。さらに、その防具カテゴリのＡランク装備が扱えるようになります。<br>　防具カテゴリの選択は自由で、カテゴリ別に習得できます。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('防具習熟Ⅱ／＊＊','冒険者レベル５以上、≪防具習熟≫／＊＊≪同じカテゴリ≫','','その防具について、さらなる知識や練度を高めます。','　＊＊のカテゴリの防具を使用した場合、常に防護点を＋２点します（合計で＋３点）。さらに、その防具カテゴリのＳランク装備が扱えるようになります。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('魔法制御','≪魔法誘導≫≪魔法収束≫','','魔法の特性を理解し、望む相手にだけ魔法の影響を与えます。','対象が「最大帯小数」を持つ魔法を行使した時、範囲内の任意のキャラクターを対象から除外し、その後の対象を決定できるようになります。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('魔法誘導','なし','','魔法を狙いすまして撃ち、対象に命中させます。','　完全ではない遮蔽や障害物に隠れている対象に「形状：射撃」の魔法を使えるようになります。さらに乱戦エリア内のキャラクターに「形状：射撃」の魔法を打ち込んでも、誤射しなくなります。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('両手利き','なし','','両手で同時にふたつの武器を扱えるようになります。','　近接攻撃、射撃を試みる際、一つの対象へ両手で１回ずつ、合計２回攻撃できます。同時に狙えるのは１体であり、別々に二つの目標を攻撃することはできません。また、どちらの命中力判定にもー２のペナルティ修正を受けます。<br>　扱える武器は、必要筋力１５以下のものに限られます。<br>　≪両手利き≫を習得しなければ、同時に二つの武器を扱うことはできません。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('ＭＰ軽減／＊＊','冒険者レベル５以上','','マナを効率的に運用し、消費を抑えます。','');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('かばう','なし','','近くの見方を気遣い、攻撃からかばいます。','');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('牽制攻撃','なし','','威力よりも命中を重視した攻撃を行います。','　すべての命中力判定に＋１のボーナス修正を得られますが、クリティカル値が＋１されます（クリティカルしにくくなります）。クリティカル値がすでに１３以上の時は≪牽制攻撃≫を宣言できません。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('牽制攻撃Ⅱ','≪牽制攻撃≫','','攻撃の挙動をさらに小さく確実に行い、より攻撃を命中させやすくします。','　すべての命中力判定に＋２のボーナス修正を得られますが、クリティカル値が＋２されます（クリティカルしにくくなります）。クリティカル値がすでに１２以上の時は≪牽制攻撃Ⅱ≫を宣言できません。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('全力攻撃','なし','','攻撃に専念し、重くダメージの高い攻撃を行います。','　近接攻撃のダメージを＋４点します。<br>　≪全力攻撃≫を行ったキャラクターは、回避力判定にー２のペナルティ修正を受けます。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('挑発攻撃','なし','','攻撃しながら相手を挑発し、攻撃を誘います。','');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('投げ攻撃','グラップラー技能習得','グラップラー技能','相手を投げ飛ばして攻撃します。','');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('必殺攻撃','なし','','急所を狙いすまし、必殺になる一撃を敵に与えます。','　近接攻撃で算出ダメージを求めるとき、クリティカル値をー１します（クリティカルさせやすくします）≪必殺攻撃≫を使ってクリティカル値を７以下にはできません（最低８）。<br>　≪必殺攻撃≫を行ったキャラクターは、回避力判定にー２のペナルティ修正を受けます。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('魔法拡大／確実化','なし','','同じ対象に何度も魔法を行使し、確実性を高めます。','　一度の手番に、同じ対象に魔法を何度も行使します。行使した回数と同じだけ「行使判定」を行い、どれか一つの達成値を選んで適用できます。ＭＰは行使した回数文消費します。<br>　威力の結果を振る効果の場合、威力の結果は一度しか振りません。<br>　この戦闘特技は他の≪魔法拡大／＊＊≫と同時に宣言できます。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('魔法拡大／数','なし','','膨大なマナを扱い、対象の数を増やします。','魔法の対象の数を拡大します。ひとつ拡大するごとに、消費数ＭＰを肺臓します（２体を狙う場合は２倍、３体なら３倍）。射程が「術者」「接触」の魔法は≪魔法拡大／数≫を宣言できません。拡大した魔法の達成値は個別に求めます（術者が望むならば、１回の判定ですべての達成値を決めても構いません）。<br>　この戦闘特技は他の≪魔法拡大／＊＊≫と同時に宣言できます。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('魔法拡大／距離','なし','','膨大なマナを扱い、魔法の射程を伸ばします。','　魔法の射程を２倍、３倍にします。射程の倍率と消費ＭＰの倍率は同じです。射程が「術者」「接触」の魔法は距離を拡大できません。<br>　この戦闘特技は他の≪魔法拡大／＊＊≫と同時に宣言できます。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('魔法拡大／時間','なし','','膨大なマナを扱い、効果時間を延ばします。','　魔法の効果時間を２倍、３倍にします。効果時間の倍率と消費ＭＰの倍率は同じです。時間が「一瞬」「永続」の魔法は時間を拡大できません。<br>　この戦闘特技は他の≪魔法拡大／＊＊≫と同時に宣言できます。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('魔法拡大／範囲','なし','','膨大なマナを扱い、効果範囲を広げます。','　魔法の範囲で「半径○m／△」と記載されているものの範囲を拡大します。<br>　消費するＭＰをばいぞうするごとに、範囲は＋１ｍされます（２倍消費で＋１ｍ、３倍で＋２ｍ）。それに応じて最大対象数も増加します。最大対象数は、乱戦エリアの中に参加できる人数の最大値となります。<br>　この戦闘特技は他の≪魔法拡大／＊＊≫と同時に宣言できます。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('魔法収束','なし','','広範囲に効果を及ぼす魔法の範囲を狭め、選んだ対象にだけ効果を与えらえれるようになります。','「最大帯小数」を持つ魔法の効果を、１体、もしくは一つに対してのみ与えらえれるようになります。');
INSERT INTO M_COMBAT_FEATS (NAME, COND, USE_SKILL, SUMMARY, DETAIL) VALUES ('魔力撃','なし','','攻撃にマナの力を借りて、魔力を攻撃の威力に上乗せします。','　近接攻撃のダメージを「魔力」点上昇させます。魔力は習得している魔法使い系技能のどれかを選びます。<br>　≪魔力撃≫を行ったキャラクターは、回避力判定、生命抵抗力判定、精神抵抗判定に－１のペナルティ修正を受けます。');

