(function ($) {

	var event = new Events();
	
	function loadImages() {
		var prefix = ['h', 'd', 's', 'c'],
			path = "http://lab.david/js/cards/_/images/cards/",
			size = {
				width: 72,
				height: 96
			},
			deck = [],
			i, l = 13,
			count = 0,
			length = 52;

		for (i = 0; i < l; i++) {
			for (var u = 0; u < 4; u++) {

				var img = new Image(size.width, size.height),
					label = prefix[u] + (i + 1),
					src = path + label + '.png';
				deck.push({
					label: label,
					img: img
				});
				deck[count].img.src = src;
				deck[count].img.onload = loaded;
				count++;

			}
		}

		function loaded() {
//			length--;
//			if (length == 0) event.despatch('IMG_LOADED');
		}
		
	}
	
	loadImages();
	
	$(document).ready(function(){
		
	})
	
	
	event.on('ABEKAT', function(){
		console.log('ABEKAT');
	});	
	
	event.on('TIGER', function(){
		console.log('TIGER');
	});	
	
	event.on(['ABEKAT','GIRAFFEN','TIGER'], function(){
		console.log('ABEKAT & GIRAFFEN & TIGER, EVENT');
	});	
	
	event.on(['ABEKAT','GIRAFFEN'], function(){
		console.log('ABEKAT & GIRAFFEN, EVENT');
	});	
	
	
	event.on('GIRAFFEN', function(){
		console.log('GIRAFFEN, 1');
	});	
	
	event.on('GIRAFFEN', function(){
		console.log('GIRAFFEN, 2');
	});	
	
	event.on(['ABEKAT','GIRAFFEN'], function(){
		console.log('ABEKAT & GIRAFFEN, EVENT 2');
	});	
	
	event.on(['ABEKAT','GIRAFFEN'], function(){
		console.log('ABEKAT & GIRAFFEN, EVENT 3');
	});	
	
	
	// Despatch
	event.despatch('GIRAFFEN');
	
	setTimeout(function(){
		event.despatch('ABEKAT');
	},500);
	
	
	setTimeout(function(){
		event.despatch('TIGER');
	},1000);
	
//	event.on(['ABEKAT','GIRAFFEN'], function(){
//		console.log('-> ABEKAT, GIRAFFEN extra');
//	});	
	
	
	
}(jQuery))