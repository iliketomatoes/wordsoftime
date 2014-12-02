! function(window, Snap){

	'use-strict';

	var document = window.document,
    docElem = document.documentElement;

	function extend( a, b ) {
	    for( var key in b ) { 
	      if( b.hasOwnProperty( key ) ) {
	        a[key] = b[key];
	      }
	    }
	    return a;
	}

	function adjustHour(hours){
		if (hours > 12) {
		    hours -= 12;
		} else if (hours === 0) {
		   hours = 12;
		}
		return hours;
	}

	function adjustMinutes(minutes){
		
		var prep,stdMin,roundedMin;

		if(minutes >= 35){

			prep = 'to';
			minutes = 60 - minutes;

			stdMin = minutes / 10;

			roundedMin = (Math.ceil(stdMin * 2) / 2).toFixed(1) * 10;

			}else{

				prep = 'past';

				stdMin = minutes / 10;

				roundedMin = (Math.floor(stdMin * 2) / 2).toFixed(1) * 10;
			}

		if(roundedMin === 0){

			prep = null;
		}

		return {

			minutes : roundedMin,

			prep : prep

		};
	}

	function WordsOfTime(el,options){

		this.el = el;

		this.snapSVG = Snap(el);

		this.canvas = null;

		this.letters = [];

		this.words = {};

		this.boxes = [];

		this.actualTime = {
			prep : null,
			minutes : null,
			hours : null
		}; 

		this.styling = {
			ratio : 11/10
		};

		this.options = extend( this.defaults, options );

		this.setSize();

		this.setUpLetters();

		this.setUpWords();

		this.setUpGrid();

		this.setUpTime();

		this.init();
	}

	WordsOfTime.prototype.defaults = {
		/*background : '#0093d0',
		activeColor : '#ffe01e',
		unactiveColor : '#199dd4',*/
		background : '#000000',
		activeColor : '#ffffff',
		unactiveColor : '#1a1918',
		fontFamily : '"Open Sans", Sans-serif'
	};

	WordsOfTime.prototype.setSize = function(){

		var self = this,
			svgHeight,
			svgWidth,
			parent = self.snapSVG.parent().node;

			svgWidth = parent.clientWidth || parent.offsetWidth;
			svgHeight = parent.clientHeight || parent.offsetHeight;
			
			//If the screen is wider than higher
			if(svgHeight * self.styling.ratio < svgWidth){

				self.styling.lineHeight = Math.round(svgHeight / 10);
				self.styling.hOffset = Math.abs(svgWidth - self.styling.lineHeight * 10)/2;
				self.styling.vOffset = 0;

			}else{
				self.styling.lineHeight = Math.round(svgWidth / 11);
				self.styling.hOffset = Math.round(self.styling.lineHeight/2);
				self.styling.vOffset = Math.abs(self.styling.lineHeight * 10 - svgHeight)/2;
			}


			//Styling the bg
			this.canvas = this.snapSVG.rect(0, 0, svgWidth, svgHeight);

			this.canvas.attr({
				fill : self.options.background
			});

	};

	WordsOfTime.prototype.setUpLetters = function(){
		var self = this;

		self.letters[0] = ['i','t','l','i','s','b','f','a','m','p','m'];
		self.letters[1] = ['a','c','q','u','a','r','t','e','r','d','c'];
		self.letters[2] = ['t','w','e','n','t','y','f','i','v','e','x'];
		self.letters[3] = ['h','a','l','f','b','t','e','n','f','t','o'];
		self.letters[4] = ['p','a','s','t','e','r','u','n','i','n','e'];
		self.letters[5] = ['o','n','e','s','i','x','t','h','r','e','e'];
		self.letters[6] = ['f','o','u','r','f','i','v','e','t','w','o'];
		self.letters[7] = ['e','i','g','h','t','e','l','e','v','e','n'];
		self.letters[8] = ['s','e','v','e','n','t','w','e','l','v','e'];
		self.letters[9] = ['t','e','n','s','e','o\'','c','l','o','c','k'];

	};

	WordsOfTime.prototype.setUpWords = function(){
		var self = this;

		self.words.itis = [
			[0,0],
			[0,1],
			[0,3],
			[0,4]
		];

		self.words.prep = {
			'to' : [
					[3,9],
					[3,10]
				],
			'past' : [
					[4,0],
					[4,1],
					[4,2],
					[4,3]
				]		
		};

		/**
		* MINUTES
		*/

		self.words.minutes = {
			'0' : [
					[9,5],
					[9,6],
					[9,7],
					[9,8],
					[9,9],
					[9,10]
				],
			'5': [
					[2,6],
					[2,7],
					[2,8],
					[2,9]
				],
			'10': [
					[3,5],
					[3,6],
					[3,7]
				],
			'15' : [
					[1,0],
					[1,2],
					[1,3],
					[1,4],
					[1,5],
					[1,6],
					[1,7],
					[1,8]
				],
			'20' : [
					[2,0],
					[2,1],
					[2,2],
					[2,3],
					[2,4],
					[2,5]
				],
			'25' : [
					[2,0],
					[2,1],
					[2,2],
					[2,3],
					[2,4],
					[2,5],
					[2,6],
					[2,7],
					[2,8],
					[2,9]
				],
			'30' : [
					[3,0],
					[3,1],
					[3,2],
					[3,3]
				]
		};


		/**
		* HOURS
		*/

		self.words.hours = {
			'1' : [
					[5,0],
					[5,1],
					[5,2]
				],
			'2' : [
					[6,8],
					[6,9],
					[6,10]
				],
			'3' : [
					[5,6],
					[5,7],
					[5,8],
					[5,9],
					[5,10]
				],
			'4' : [
					[6,0],
					[6,1],
					[6,2],
					[6,3]
				],
			'5' : [
					[6,4],
					[6,5],
					[6,6],
					[6,7]
				],
			'6' : [
					[5,3],
					[5,4],
					[5,5]
				],
			'7' : [
					[8,0],
					[8,1],
					[8,2],
					[8,3],
					[8,4]
				],
			'8' : [
					[7,0],
					[7,1],
					[7,2],
					[7,3],
					[7,4]
				],
			'9' : [
					[4,7],
					[4,8],
					[4,9],
					[4,10]
				],
			'10' : [
					[9,0],
					[9,1],
					[9,2]
				],
			'11' : [
					[7,5],
					[7,6],
					[7,7],
					[7,8],
					[7,9],
					[7,10]
				],
			'12' : [
					[8,5],
					[8,6],
					[8,7],
					[8,8],
					[8,9],
					[8,10]
				]
		};

	};

	WordsOfTime.prototype.setUpGrid = function(){

		var self = this;
		
		for(var i = 0; i < self.letters.length; i++){

			self.boxes[i] = new Array;

			for(var j = 0; j < self.letters[i].length; j++){

				var box = self.snapSVG.text(
					Math.round((self.styling.lineHeight * j) + self.styling.hOffset),
					Math.round((((self.styling.lineHeight * 95)/100) * (i + 1)) + self.styling.vOffset), 
					self.letters[i][j]);


				box.attr({
					'data-row' : i,
					'data-column' : j,
					fill : self.options.unactiveColor,
					'font-size': Math.round(self.styling.lineHeight * 2 / 3) + 'px',
					'text-anchor': 'middle',
					'font-family' : self.options.fontFamily
				});

				self.boxes[i].push(box);
			}
		}

	};

	WordsOfTime.prototype.setUpTime = function(){

		var self = this,
			date, 
			hours, 
			minutes;

		var date = new Date();

		minutes = date.getMinutes();

		var wordsOfMinutes = adjustMinutes(minutes);

		hours = date.getHours();

		if(wordsOfMinutes.prep === 'to'){
			hours++;
		}

		var wordsOfHours = adjustHour(hours);

		if(this.actualTime.minutes !== wordsOfMinutes.minutes || this.actualTime.hours !== wordsOfHours.hours){

			self.switchOffAll();

			self.switchOn(self.words.itis);

			self.switchOn(self.words.hours[wordsOfHours]);

			if(wordsOfMinutes.prep !== null){

				self.switchOn(self.words.prep[wordsOfMinutes.prep]);

			}

			self.switchOn(self.words.minutes[wordsOfMinutes.minutes]);

		}

		this.actualTime.prep = wordsOfMinutes.prep;
		this.actualTime.minutes =  wordsOfMinutes.minutes;
		this.actualTime.hours =  wordsOfHours.hours;

	};

	WordsOfTime.prototype.switchOn = function(stringArr){

		var self = this;

		for(var i = 0; i < stringArr.length; i++){

			self.snapSVG.select('text[data-row="' + stringArr[i][0] + '"][data-column="' + stringArr[i][1] + '"]').attr({
			    fill: self.options.activeColor
			});
		}

	};

	WordsOfTime.prototype.switchOffAll = function(){
		var self = this;

		self.snapSVG.selectAll('text').attr({
		    fill: self.options.unactiveColor
		});
		
	};

	WordsOfTime.prototype.init = function(){
		var self = this;

		self.timeout = setInterval(function(){
			self.setUpTime();
		},30000);
		
	};

	window.WordsOfTime = WordsOfTime;

}(window, Snap);