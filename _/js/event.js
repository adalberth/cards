(function () {
	function Event() {
		this.id = this.randomID();
		this.callbacks = [];
	}
	
	Event.prototype = {
		constructor: Event,
		add: function (func) {
			this.callbacks.push(func);
		},
		fire: function (data) {
			var i, l = this.callbacks.length;
			for (i = 0; i < l; i++) {
				if(typeof(this.callbacks[i]) === "object"){
					this.callbacks[i].fire(data,this.id);
				}else{
					this.callbacks[i](data);
				}
			}					
		},
		randomID: function (length) {
			return Math.floor((1 + Math.random()) * 0x10000000).toString(16).substring(1);
		}
	};
	
	
	function EventMultiple(func,l){
		this.func = func;
		this.l = l;
		this.reset();
	}
	
	EventMultiple.prototype = { 
		constructor: EventMultiple,
		fire:function(data, id){
			
			for(var obj in data){
				if(this.d[obj] === undefined){
					this.d[obj] = data[obj];
				}else{
					// if obj is the same, add random id to the name.
					this.d[obj + "_" + this.randomID()] = data[obj];
				}
			}
			
			if(this.lastCaller !== id) this.c++;
			
			this.lastCaller = id;
			   
			if(this.c === this.l){
				this.func(this.d);
				this.reset();
			}
			
			
			
		},
		reset:function(){
			this.c = 0;
			this.d = {};
			this.lastCaller = null;
		},
		randomID: function (length) {
			return Math.floor((1 + Math.random()) * 0x10000000).toString(16).substring(1);
		},
	};
	
	function Events() {
		this.events = [];
	}

	Events.prototype = {
		constructor: Events,
		on: function () {
			var i, l = arguments.length - 1;
			for (i = 0; i < l; i++) {
				var key = arguments[i];
				switch(typeof(key)){
					case "object":
						this.multipleEvent(key,arguments[l]);	
					break;
					default:
						this.singleEvent(key,arguments[l]);
					break;
				}
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
//				this.singleEvent(key, function(data){
//					eventMultiple.fire(data);
//				});
				
				this.singleEvent(key, eventMultiple)
			}
		},
		dispatch: function (key, obj) {
			if (this.events[key]) {
				var data = obj || {};
				this.events[key].fire(data);
			} else {
				//console.error("[Events] No event matches: '" + key + "' will try a async dispatch [dispatchasync]");
				this.dispatchasync(key, obj);
			}
		},
		dispatchasync: function (key, obj) {
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