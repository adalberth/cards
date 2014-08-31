(function ($) {
	'use strict';

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
			length--;
			if (length == 0) event.dispatch('IMG_LOADED', {
				deck: deck
			});
		}

	}

	loadImages();

	$(document).ready(function () {
		event.dispatch('DOCUMENT_READY');
	})

	event.on(['IMG_LOADED', 'DOCUMENT_READY'], function (data) {
		var deck = new Deck(data.deck);
		var deckView = new DeckView(deck);

		$('.prev').click(function () {
			deck.prev();
		});

		$('.next').click(function () {
			deck.next();
		});

		$('.new-deck').click(function () {
			deck.newDeck();
		});

		$('.restart').click(function () {
			deck.restart();
		});
	})


	function Deck(deck) {
		this.deck = deck;
		this.event = new Events();

		this.init();
	}

	Deck.prototype = {
		constructor: Deck,
		on: function (v, f) {
			this.event.on(v, f);
		},
		init: function () {
			this.reset();
			this.render();
		},
		newDeck: function () {
			this.event.dispatch('NEW_DECK');
			this.init();
		},
		reset: function () {
			this.setNull();
			this.sort();
		},
		restart: function () {
			this.event.dispatch('RESTART');
			this.setNull();
			this.render();
		},
		setNull: function () {
			this.currentCard = 0;
		},
		sort: function () {
			this.deck.sort(function () {
				return Math.random() < 0.5 ? 1 : -1;
			});
		},
		render: function () {
			this.event.dispatch('RENDER', {
				deck: this.deck,
				card: this.deck[this.currentCard]
			})
		},
		prev: function () {
			if (this.currentCard > 0){
				this.currentCard--;
			} 
			this.render();
		},
		next: function () {
			if (this.currentCard < this.deck.length - 1){
				this.currentCard++;
			}
			this.render();
		}
	};

	window.Deck = Deck;

	function DeckView(deck) {
		this.deck = deck;
		this.$cards = $('.cards');
		this.init();
	}

	DeckView.prototype = {
		constructor: DeckView,
		init: function () {
			this.bind();
		},
		bind: function () {
			this.deck.on('RENDER', $.proxy(this.render,this));
			this.deck.on('NEW_DECK', $.proxy(this.empty,this));
			this.deck.on('RESTART', $.proxy(this.empty,this));
		},
		render: function (data) {
			this.$cards.append(data.card.img);
			TweenMax.to($(data.card.img),0.25,{
				rotationZ:this.random(),
				x:this.random(),
				y:this.random()
			});
		} ,
		empty:function(){
			this.$cards.empty();
		} ,
		random:function(){
			return (Math.random() * 2 - 1) * 5;
		}
	};

	window.DeckView = DeckView;

}(jQuery))