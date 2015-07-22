(function(){
	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				function( callback ){
					window.setTimeout(callback, 1000 / 60);
				};
	})();
	function hslToRgb(h, s, l) {
		var r, g, b;

		if (s == 0) {
			r = g = b = l; // achromatic
		} else {
			var hue2rgb = function hue2rgb(p, q, t) {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			}

			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
	
	//todo: properly export these with utility function
	var logoBG = {
		init: function(){
			logoBG._canvas = document.getElementById('logoBackground');

			if ((window.innerWidth && window.innerWidth < 769) || (document.body.clientWidth < 769)) {
				logoBG._w = 100;
				logoBG._h = 100;
			} else {
				logoBG._w = 144;
				logoBG._h = 144;
			}
			logoBG._canvas.setAttribute('width', logoBG._w);
			logoBG._canvas.setAttribute('height', logoBG._h);
		},
		continueAnim: function(type, length){
			return (logoBG.current == type) && (Math.abs(new Date() - logoBG[type+'_runtime']) < length);
		},
		bytes_init: function () {
			logoBG._bytes = [];
			for(var i = 0; i < 50; i++){
				logoBG._bytes.push({
					text: (Math.random() > .5) ? "0" : "1",
					x: Math.floor(Math.random() * 144),
					y: 0,
					speed: 3.5,
					delay: Math.floor(Math.random()*30)
				});
			}
		},
		bytes: function(){
			var ctx = logoBG._canvas.getContext("2d");
			ctx.fillStyle = "rgba(0,0,0,.15)";
			ctx.fillRect(0, 0, logoBG._w, logoBG._h);

			ctx.fillStyle = '#83AA30';//'#00ff00';
			ctx.font = "11px sans-serif";
			for (var i = 0; i < logoBG._bytes.length; i++) {
				if (logoBG._bytes[i].delay < 0){					
					ctx.fillText(
						logoBG._bytes[i].text,
						logoBG._bytes[i].x, 
						logoBG._bytes[i].y);
						
					logoBG._bytes[i].y += logoBG._bytes[i].speed;
				} else {
					logoBG._bytes[i].delay -= 1;
				}
			}
			
			if (logoBG.continueAnim('bytes', 2000)){
				requestAnimFrame(logoBG.bytes);
			}
		},
		//pangram selections!
		words_corpus: [
			"the quick,brown fox,jumped over,a lazy dog.,Jackie will,the  most expensive,zoology equipment.",
			"grumpy wizards,make toxic,brew for the,evil queen,and jack.,just keep examining,every low bid",
			"quick movement,of the enemy,will jeopardize,six gunboats,every low bid,quoted for,zinc etchings",
			"few black,taxis drive,up major roads,on quiet,hazy nights,jinxed the,gnomes before,they vaporized"
		],
		words_init: function () {
			logoBG._words = logoBG.words_corpus[Math.floor(Math.random() * logoBG.words_corpus.length)].split(',');
			logoBG._currentLine = 0;
			logoBG._currentWord = 0;

			//var ctx = logoBG._canvas.getContext("2d");
			//logoBG.words_bg(ctx);
		},
		words_bg: function(ctx, opacity){
			ctx.fillStyle = "rgba(255,255,255,"+opacity+")";
			ctx.fillRect(0, 0, logoBG._w, logoBG._h);
		},
		_drawLetter: function(ctx, line, letter, x, y, fontSize){
			ctx.font = fontSize+"px monospace";
			ctx.fillStyle = "#000";
			ctx.fillText(logoBG._words[line][letter],x,y);
			ctx.fillStyle = "#222";
			ctx.fillText(logoBG._words[line][letter],x+1,y+1);
		},
		words: function () {
			if (logoBG._currentLine > logoBG._words.length-1)
				return;

			var ctx = logoBG._canvas.getContext("2d");
			var fontSize = 18;
			var x = logoBG._currentWord * (fontSize-1),
				y = (logoBG._currentLine * (fontSize+2))+fontSize;
				
			if (logoBG._currentLine == 0){
				logoBG.words_bg(ctx, .2);
				for(var i = 0; i < logoBG._currentWord; i++){
					logoBG._drawLetter(ctx, 0, i, i * (fontSize-1), y, fontSize);
				}
			} else {
				logoBG._drawLetter(ctx, logoBG._currentLine, logoBG._currentWord,x,y, fontSize);
			}

			logoBG._currentWord++;
			if (logoBG._currentWord > logoBG._words[logoBG._currentLine].length) {
				logoBG._currentWord = 0;
				logoBG._currentLine++;
			}

			//}

			if (logoBG.continueAnim('words', 2000)) {
				requestAnimFrame(logoBG.words);
			}
		},
		pixels_init: function () {
			logoBG._pixels = [];
			for (var i = 0; i < 144; i++) {
				var rgb = hslToRgb(.5916, Math.random(), Math.random());
				logoBG._pixels.push({
					color: 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')',
					x: (Math.floor(i / 12)) * 12,
					y: (i % 12) * 12,
					delay: Math.floor(Math.random() * 25),
					duration: 25 + Math.floor(Math.random() * 25)
				});
			}
		},
		pixels: function(){
			var ctx = logoBG._canvas.getContext("2d");
			//ctx.fillStyle = "rgba(0,0,0,.25)";
			//ctx.fillRect(0, 0, logoBG._w, logoBG._h);

			for (var i = 0; i < logoBG._pixels.length; i++) {
				if (logoBG._pixels[i].duration < 0) {
					ctx.fillStyle = "#F0F8FF";
				} else {
					ctx.fillStyle = logoBG._pixels[i].color;
				}
				if (logoBG._pixels[i].delay < 0) {
					ctx.fillRect(
						logoBG._pixels[i].x,
						logoBG._pixels[i].y,
						12, 12);
					logoBG._pixels[i].duration -= 1;
				} else {
					logoBG._pixels[i].delay -= 1;
				}
			}

			if (logoBG.continueAnim('pixels', 1500)) {
				requestAnimFrame(logoBG.pixels);
			}
		},
		about_init: function () {
			function pushPixel(x, y, w) {
				logoBG._sweep.push({
					x: x,
					y: y,
					w: w
				});
			}
			logoBG._sweep = [];
			pushPixel(0, 0, logoBG._w);
			for (var i = 0; i < 72; i++) {
				pushPixel(Math.floor(Math.random() * 144), -1, 1);
			}
			for (var i = 0; i < 36; i++) {
				pushPixel(Math.floor(Math.random() * 144), -2, 1);
			}
		},
		about: function () {
			var ctx = logoBG._canvas.getContext("2d");
			var currentPixel, lastY;
			ctx.fillStyle = "rgba(255,255,255,.2)"; //white
			ctx.fillRect(0, 0, logoBG._w, logoBG._sweep[0].y);

			for (var i = 0; i < logoBG._sweep.length; i++) {
				currentPixel = logoBG._sweep[i];
				ctx.fillStyle = "#f15a29"; //orange
				ctx.fillRect(
					currentPixel.x,
					currentPixel.y,
					currentPixel.w, 4);
				lastY = currentPixel.y;
				currentPixel.y += 4;
			}

			if (logoBG.continueAnim('about', 2000)) {
				requestAnimFrame(logoBG.about);
			}
		},
		home_init: function(){
			logoBG._hexes = [{ size: 50, stroke: "rgb(64, 64, 65)" }, { size: 25, stroke: "#f15a29" }, { size: 0, stroke: "#FFF", width: 4 }];
		},
		home_drawHex: function(ctx, hex){
			var numberOfSides = 6,
				Xcenter = logoBG._w / 2,
				Ycenter = logoBG._h / 2;
				
			ctx.beginPath();         

			for (var i = 0; i < numberOfSides+1; i++) {
				var angle_deg = 60 * i   + 30
				var angle_rad = Math.PI / 180 * angle_deg
				var func = (i == 0) ? "moveTo" : "lineTo";
				ctx[func](
					Xcenter + hex.size * Math.cos(angle_rad), 
					Ycenter + hex.size * Math.sin(angle_rad));
			}
			ctx.strokeStyle = hex.stroke;
			ctx.lineWidth = hex.width || 2;
			ctx.stroke();
		},
		home: function() {
			var ctx = logoBG._canvas.getContext("2d");
			
			for (var i = 0; i < logoBG._hexes.length; i++) {
				logoBG.home_drawHex(ctx, logoBG._hexes[i]);
				logoBG._hexes[i].size += 2;
			}
			
			if (logoBG.continueAnim('home', 2000)) {
				requestAnimFrame(logoBG.home);
			}
		},
		run: function(type){
			type = (logoBG[type]) ? type : logoBG.aliases[type];
			if (logoBG[type]){				
				logoBG[type+"_runtime"] = new Date();
				logoBG.current = type;
				logoBG[type+"_init"]();
				logoBG[type]();
			}
		},
		aliases: {
			'pro': 'bytes',
			'student': 'bytes'
		}
	};
	window.logoBG = logoBG;
	logoBG.init();
	window.onresize = function(){
		logoBG.init();
	}
	
	var anim = {
		viewBackground: {
			_current: '#1499D3',
			bytes: '#83AA30',
			pro: '#83AA30',
			student: '#83AA30',
			pixels: '#4D6684',
			words: '#3D3D3D',
			about: '#1499D3',
			home: '#1499D3'
		},
		currentState: ""
	};
	
	window.anim = anim;
	
	var spa = {
		404: "<h1>Page Not Found</h1>",
		_get: function(aUrl, aCallback){
			var anHttpRequest = new XMLHttpRequest();
			anHttpRequest.onreadystatechange = function() { 
				if (anHttpRequest.readyState == 4){
					if (anHttpRequest.status == 200){
						aCallback(anHttpRequest.responseText);
					} else {
						aCallback(spa[anHttpRequest.status]);
					}
				}
			}

			anHttpRequest.open( "GET", aUrl, true );            
			anHttpRequest.send( null );
		},
		renderView: function(toView, response){
			(document.querySelectorAll('.view')[0]).innerHTML = response;
			
			//bad, failed hack at getting new imgur embeds to work
			var newScript = document.createElement('script');			
			newScript.src = "//s.imgur.com/min/embed.js";
			document.body.appendChild(newScript);
			
			window.history.pushState({}, toView, toView);
			playIFrame.init();
			spa.transformLinks();
		},
		onChange: function(toView){
			var header = (document.querySelectorAll('header')[0]);
			var viewName = (toView||"").replace(/.*\//g, '').replace('.html', '');
			
			if (header.classList.contains('animated-gradient'))
				header.classList.remove('animated-gradient');

			//css animation restart hack
			header.offsetWidth = header.offsetWidth;

			var nextBackground = anim.viewBackground[viewName];
			header.setAttribute('style', 'background-image: linear-gradient(0deg, ' + anim.viewBackground._current + ', ' + anim.viewBackground._current + ', ' + nextBackground + ', ' + nextBackground + ');');
			anim.viewBackground._current = nextBackground;
			header.classList.add('animated-gradient');
			//shield color
			document.getElementById('RightShield').setAttribute('fill', nextBackground);
			
			header.classList.add('active');
			logoBG.run(viewName);
		},
		onNavigate: function(){
			var newView = this.dataset.spaHref;				
			spa.navigate(newView);
		},
		navigate:function(toView, noTransition){
			spa._get(toView, function(response){
				if (!noTransition)
					spa.onChange(toView);
					
				spa.renderView(toView, response);
			});
		},
		transformLinks: function(){
			var links = document.querySelectorAll('[data-spa-href]');
			for(var i = 0; i < links.length; i++){
				if (links[i].href != 'javascript:void(0);'){
					links[i].addEventListener("click", spa.onNavigate);
					if (links[i].dataset.spaHref == '')
						links[i].setAttribute('data-spa-href', links[i].href);
					links[i].href = 'javascript:void(0);';
				}
			}
		}
	};
	spa.transformLinks();
	spa.navigate('home.html', true);
	window.spa = spa;
	
	var playIFrame = {
		init: function(){
			var players = document.querySelectorAll('.lazy-iframe');
			for(var i = 0; i < players.length; i++){
				for(var j = 0; j < players[i].children.length; j++){
					if (players[i].children[j].tagName == "IFRAME"){
						players[i]._iframe = players[i].children[j];
					} else if (players[i].children[j].tagName == "DIV"){
						players[i].children[j].addEventListener('click', function () {
							this.parentNode._iframe.setAttribute('src', this.parentNode._iframe.dataset.src);
							this.parentNode.removeChild(this);
						});
					}
				}
			}
		}
	};
	window.playIFrame = playIFrame;
	playIFrame.init();
	
	document.addEventListener('DOMContentLoaded', function(){
		var inlines = document.querySelectorAll('.svg-inline');
		for(var i = 0; i < inlines.length; i++){
			var currentInline = inlines[i];
			var xhr = new XMLHttpRequest();
			xhr.open("GET", currentInline.getAttribute('src'), true);
			// Following line is just to be on the safe side;
			// not needed if your server delivers SVG with correct MIME type
			xhr.overrideMimeType("image/svg+xml");
			xhr.send("");
			xhr.onload = function(){
				currentInline.parentNode.replaceChild(xhr.responseXML.documentElement, currentInline);
			}
		}
	});
})();