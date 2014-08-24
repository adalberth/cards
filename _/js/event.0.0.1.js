(function () {
	function Event() {
		this.callbacks = [];
	}
	
	Event.special = [];
	
	Event.prototype = {
		constructor: Event,
		add: function (func) {
			this.callbacks.push(func);
		},
		fire: function (data) {

			var i, l = this.callbacks.length;
			for (i = 0; i < l; i++) {
				this.callbacks[i](data);
			}					
		}
	};
	
	
	function EventMultiple(func,untilFire){
		this.func = func;
		this.untilFire = untilFire;
		this.count = 0;
	}
	
	EventMultiple.prototype = { 
		constructor: EventMultiple,
		fire:function(){
			if(++this.count === this.untilFire){
				this.func();
			}
		}
	};
	
	window.EventMultiple = EventMultiple;


	function Events() {
		this.events = [];
		this.eventsMultiple = [];
	}

	Events.prototype = {
		constructor: Events,
		on: function (key, func) {

			switch(typeof(key)){
				case "object":
					this.multipleEvent(key,func);	
				break;
				default:
					this.singleEvent(key,func);
				break;
			}
			
		},
		singleEvent:function(key,func){
			if (this.events[key] === undefined) this.events[key] = new Event();
			this.events[key].add(func);
		},
		multipleEvent:function(obj,func){
			var i, l = obj.length,
				eventMultiple = new EventMultiple(func,l);
			
			for (i = 0; i < l; i++) {
				var key = obj[i];
				this.singleEvent(key, function(){
					eventMultiple.fire();
				});
			}
		},
		despatch: function (key, obj) {
			
			if(this.eventsMultiple[key]){
				var data = obj || {};
				this.eventsMultiple[key].fire(data);
			}
			
			
			if (this.events[key]) {
				var data = obj || {};
				this.events[key].fire(data);
			} else {
				//console.error("[Events] No event matches: '" + key + "' will try a async despatch [despatchasync]");
				this.despatchasync(key, obj);
			}
		},
		despatchasync: function (key, obj) {
			var that = this;
			setTimeout(function () {
				if (that.events[key]) {
					var data = obj || {};
					that.events[key].fire(data);
				} else {
					//console.error("[Events] No event matches: '" + key + "'");
				}
			}, 0);
		}
	};

	window.Events = Events;
}());