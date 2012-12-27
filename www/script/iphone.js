var doc = document;

var $ = function(query){return doc.querySelector(query);};

var init = function(){
	var _page = doc.querySelector('.page');
	_page.style.display="";

	var _buttons = doc.querySelectorAll('.button');

	for(var i=_buttons.length -1 ; i>=0;i--){
		var _btn = _buttons[i];
		_btn.addEventListener('click',function(){
			var _link = this.getAttribute('link');
			if(!!_link){
				this.parentNode.style.display = "none";
				var _linkedPage = $('#page_' + _link);
				if(_linkedPage){
					_linkedPage.style.display = "";
					var title = _linkedPage.getAttribute("name");
					if(title){
						doc.title = title + '- eizia mockup';
					}
				}
			}

		});
	}
};

init();
