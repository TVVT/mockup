var doc = document;

init = function(){
	var _page = doc.querySelector('.page');
	_page.style.display="";

	var _buttons = doc.querySelectorAll('.button');

	for(var i=_buttons.length -1 ; i>=0;i--){
		var _btn = _buttons[i];
		_btn.addEventListener('click',function(){
			this.parentNode.style.display = "none";
			var _link = this.getAttribute('link');
			doc.querySelector('#page_' + _link).style.display = ""; 
		});
	}

};

init();
