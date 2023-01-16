$(function(){
	//chrome.storage.sync.remove("newData")
	var tempo = []
	function isUrl(url){
		var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
		var regex = new RegExp(expression);
		if (url.match(regex))
			return true
		else
			return false
	}
	function setHistory(){
		var data = $('#inData').val();
		if(data)	
		{
			tempo.unshift(data) 	//add to start
			chrome.storage.sync.set({'newData':tempo});
			if($(`body`).find('#element0').length>0)
				$(`#element${f}`).prepend(`<p id='element${--f}'>${data}</p>`)
			else
				$('body').append(`<p id='element${f}'>${data}</p>`)

			// if(isUrl(data))
			// 	$(`#element${f}`).html(`<a href='${data}' target='_blank'>${data}</a>`)
				//also $('').get(0).innerHTML= applicable !!STRUGGLE
		}
	}

	$('#inData').focus();
	chrome.storage.sync.get('newData', function(data){
		if(data.newData	){
			tempo = data.newData;	
			for(var k in tempo)
			{
				var app = `<p id='element${k}'>${tempo[k]}</p>`
				// if(isUrl(tempo[k]))
				// 	app = `<p id='element${k}'><a href='${tempo[k]}' target='_blank'>${tempo[k]}</a></p>`
				$('body').append(app)
			}
		}
	});

	var f = 0;
	$('#inData').keypress(function(event) {
		if (event.keyCode == 13 || event.which == 13) {
			event.preventDefault()
			setHistory();
		}
	});

	$('#add').click(function(event){
		setHistory();
		$(this).blur();
		var curl = $(`#element${f}`).html();
		if(isUrl(curl))
		{
			chrome.windows.create({url: curl, incognito: true });
		}
		else
		{
			var gsearch = "https://www.google.com/search?q="
			chrome.windows.create({url: `${gsearch}+${curl}`, incognito: true });
		}
		
	});

	$('#curbtn').click(function(event){
		chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
  			var curUrl = tabs[0].url;
			$('#inData').val(curUrl).focus();		
		});
	});
});
