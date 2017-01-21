var newMark = function(y,m,d) {
	var oldDay = new Date(y+"/"+m+"/"+d),
		newDay = new Date(),
		n = (newDay - oldDay)/(1000*60*60*24);
	if (n <= 7) document.write("<img src='img/new_item.gif' style='vertical-align:middle;'>");
};

var RandomTop = function(){
	var source = new Array("hayato", "nagisa", "mei", "rin", "nene", "ayame"),
		rand = Math.floor(Math.random()*6);
	document.querySelector('#topChara').src = './img/' + source[rand] + '_top.png';
};


window.onload = function() {
  RandomTop();
};