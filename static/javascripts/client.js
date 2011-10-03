var ctx, mainCanvas, client, activeTool;

var store = window.localStorage;



var CONFIG = {
			clientId: "#",
			tool: 'brush',
			color: {},
			gameStarted: false,
			myTurn: false
		};
		


$(document).ready(function() {
	
function init() {
	
	
	// Connect
	
	now.join = function(data) {
		CONFIG.clientId = data.clientId;
		//loadFromLocalStorage()
  	};
	
	
	
	// Draw Events
	
	var t;
	
	now.clientDrawStart = function(data) {
		t = new tools[data.tool];
		t.drawStart(data.x, data.y);
	};
	
	now.clientDraw = function(data) {
		t.draw(data.point);
	};
	
	now.clientDrawEnd = function(data) {
		t.drawEnd();
	};
	
	now.clientChangeBackground = function(data) {
		mainCanvas.css('backgroundColor', data.color);
	};
	
	
	
	// Game Events
	
	now.updatePlayers = function(data) {
		$("div#sub-headline h3 span").html('People online (' + (data.players.length - 1) + ')');
		
		CONFIG.gameStarted = data.gameStarted;
		
		CONFIG.gameStarted ? $('#gameState').text('Game started').show() : $('#gameState').hide();
	};
	
	now.startGame = function() {
		CONFIG.gameStarted = true;
		CONFIG.gameStarted ? $('#gameState').text('Game started').show() : $('#gameState').hide();
		$('#currentStatus').show();
	};

	now.endGame = function() {
		CONFIG.gameStarted = false;
		CONFIG.gameStarted ? $('#gameState').text('Game started').show() : $('#gameState').hide();
		$('#currentStatus').hide();
		$('#play a').hide();
		$('#playersOnline').text('No players online.');
	};
	
	now.yourTurn = function() {
		CONFIG.myTurn = true;
		$('#currentStatus').text('Your turn.');
		$('#play a').show();
		
		alert('your turn');
	};
	
	
	// Play move
	
	$('#play a').click(function() {
		CONFIG.myTurn = false;
		$('#currentStatus').text('Waiting for opponent...');
		$('#play a').hide();
		now.playMove();
	});
	
	
	
	
	// Bindings
	
	mainCanvas = $('#main-canvas');
	ctx = mainCanvas[0].getContext('2d');
	
  	mainCanvas.bind('mousedown', canvasMove, false);
  	mainCanvas.bind('mousemove', canvasMove, false); 
  	mainCanvas.bind('mouseup',   canvasMove, false);
  	
  	$('#clear').bind('click', function() {
  		if (!CONFIG.myTurn) return;
  		clearCanvas();
  	});
  	
  	$('#tools').bind('click', function() {
  		if (!CONFIG.myTurn) return;
  		$('#tools').toggleClass('active');
  	});
  	
  	$('#color a').bind('click', function() {
		if (!CONFIG.myTurn) return;
  		$('#color').toggleClass('active');
  	});
  	
  	$('#toolsHolder ul li').bind('click', function() {
  		activeTool = new tools[$(this).attr('id')]();
  		CONFIG.tool = $(this).attr('id');
  	})
  	
  	CONFIG.color = randomizeColor();
  	
  	loadColorPicker();
  	
  	activeTool = new tools[CONFIG.tool]();
}
	
	


// Brushes

var tools = {};

tools.brush = function() {
	var tool = this;
	this.started = false;
	
	

 	this.mousedown = function (ev) {
		tool.drawStart(ev._x, ev._y);
		now.drawStart({ 'x': ev._x, 'y': ev._y, 'tool': CONFIG.tool });
    };

    this.mousemove = function (ev) {
    	if (tool.started) {
      
      		point = {
				x: ev._x,
				y: ev._y,
				tool: CONFIG.tool,
				color: CONFIG.color.foreground,
				size: 4,
				clientId: CONFIG.clientId	
			};
		
			tool.draw(point);
			now.draw({ 'point': point });
    	}
    };

  	this.mouseup = function (ev) {
    	tool.drawEnd();
    	now.drawEnd({ 'tool': CONFIG.tool });
  	};
  	
  	
  	this.drawStart = function(x, y) {
		ctx.beginPath();
		ctx.moveTo(x, y);
        tool.started = true;
	}


  	this.draw = function(point) {
		ctx.lineTo(point.x, point.y);
		ctx.strokeStyle = point.color;
		ctx.lineWidth = point.size;
		ctx.lineCap = 'round'
		ctx.lineJoin = 'round';
		ctx.stroke();
	}
	
	this.drawEnd = function() {
		if (tool.started) {
      		ctx.closePath();
      		tool.started = false;
      		//saveToLocalStorage();
    	}
	}
};



tools.pencil = function() {
	var tool = this;
	this.started = false;
	
	ctx.globalCompositeOperation = "source-over";
    this.points = new Array();
    this.count = 0;

 	this.mousedown = function (ev) {
		tool.drawStart(ev._x, ev._y);
		now.drawStart({ 'x': ev._x, 'y': ev._y, 'tool': CONFIG.tool });
    };

    this.mousemove = function (ev) {
    	if (tool.started) {
      
      		point = {
				x: ev._x,
				y: ev._y,
				tool: CONFIG.tool,
				color: CONFIG.color.foreground,
				size: 0.8,
				clientId: CONFIG.clientId	
			};
		
			tool.draw(point);
			now.draw({ 'point': point });
    	}
    };

  	this.mouseup = function (ev) {
    	tool.drawEnd();
    	now.drawEnd({ 'tool': CONFIG.tool });
  	};
  	
  	
  	this.drawStart = function(x, y) {
		ctx.beginPath();
		ctx.moveTo(x, y);
        tool.started = true;
	}


  	this.draw = function(point) {
  		var e, b, a, g;
        this.points.push([point.x, point.y]);
        ctx.lineWidth = point.size;
        ctx.strokeStyle = point.color;
        ctx.beginPath();
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        for (e = 0; e < this.points.length; e++) {
            b = this.points[e][0] - this.points[this.count][0];
            a = this.points[e][1] - this.points[this.count][1];
            g = b * b + a * a;
            if (g < 3000 && Math.random() > (g / 500)) {
                ctx.beginPath();
                ctx.moveTo(this.points[this.count][0] + (b * 0.3), this.points[this.count][1] + (a * 0.3));
                ctx.lineTo(this.points[e][0] - (b * 0.3), this.points[e][1] - (a * 0.3));
                ctx.stroke()
            }
        }
        this.count++
	}
	
	this.drawEnd = function() {
		if (tool.started) {
      		ctx.closePath();
      		tool.started = false;
      		//saveToLocalStorage();
    	}
	}
};


	

// Utility Functions

function canvasMove (ev) {
	
	if (!CONFIG.myTurn)
		return;
	
	if (ev.clientY || ev.clientX == 0) {
		ev._x = ev.clientX - this.offsetLeft;
	    ev._y = ev.clientY - this.offsetTop;
	}

	var func = activeTool[ev.type];
    if (func) {
    	func(ev);
    } 
}

function clearCanvas() {
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, mainCanvas.width(), mainCanvas.height());
	ctx.restore();
	//saveToLocalStorage();
}

function randomizeColor() {
	
		var r = Math.round(Math.random() * 255);
		var g = Math.round(Math.random() * 255);
		var b = Math.round(Math.random() * 255);
	
	color = {
		foreground: 'rgb(' + r + ',' + g +',' + b + ')',
		background: '#ffffff'
	};
	
	return color;
}

function loadColorPicker() {
	
	 $('#preview').css('backgroundColor', CONFIG.color.foreground);
	 $('#foreground').css('backgroundColor', CONFIG.color.foreground);
	
	var select = false;
	var foregroung = true;
	var background = false;
	
	var ctx = $('#colorPicker')[0].getContext('2d');  
    var img = new Image();  
    img.onload = function(){  
      ctx.drawImage(img,0,0); 
    };  
    img.src = 'images/color-picker.png';  
    
    $('#colorPicker').mousedown(function(e) {
    	select = true;
	    var data = ctx.getImageData(e.clientX - $(this).offset().left, e.clientY - $(this).offset().top, 1, 1).data;
	    $('#preview').css('backgroundColor', 'rgb(' + [].slice.call(data, 0, 3).join() + ')');
	    
	    if (foreground) {
		   	 CONFIG.color.foreground = 'rgb(' + data[0] + ',' + data[1] +',' + data[2] + ')';
		     $('#foreground').css('backgroundColor', CONFIG.color.foreground);
		} else {
		   	 CONFIG.color.background = 'rgb(' + data[0] + ',' + data[1] +',' + data[2] + ')';
		     $('#background').css('backgroundColor', CONFIG.color.background);
		     mainCanvas.css('backgroundColor', CONFIG.color.background);
		     //saveToLocalStorage();
		     
		     now.changeBackground({ 'color': CONFIG.color.background });
		}

	});
	
	$('#colorPicker').mousemove(function(e) {
    	if (select) {
		    var data = ctx.getImageData(e.clientX - $(this).offset().left, e.clientY - $(this).offset().top, 1, 1).data;
		    $('#preview').css('backgroundColor', 'rgb(' + [].slice.call(data, 0, 3).join() + ')');
		    
		    if (foreground) {
		    	 CONFIG.color.foreground = 'rgb(' + data[0] + ',' + data[1] +',' + data[2] + ')';
		    	 $('#foreground').css('backgroundColor', CONFIG.color.foreground);
		    } else {
		    	CONFIG.color.background = 'rgb(' + data[0] + ',' + data[1] +',' + data[2] + ')';
		    	$('#background').css('backgroundColor', CONFIG.color.background);
		    	mainCanvas.css('backgroundColor', CONFIG.color.background);
		    	//saveToLocalStorage();
		    	
		    	now.changeBackground({ 'color': CONFIG.color.background });
		    }
	    					
    	}
	});
	
	$('#colorPicker').mouseup(function(e) {
    	select = false;
	});
	
	$('#foreground').click(function() {
		foreground = true;
		background = false;
		$('#preview').css('backgroundColor', $(this).css('backgroundColor'));
	}); 
	
	$('#background').click(function() {
		background = true;
		foreground = false;
		$('#preview').css('backgroundColor', $(this).css('backgroundColor'));
	});
}



// Local Storage

function saveToLocalStorage() {
	if (window['localStorage'] !== null) {
    	localStorage['canvas'] = document.getElementById('main-canvas').toDataURL('image/png');
    }
}

function loadFromLocalStorage() {	
	if (window['localStorage'] !== null && localStorage['canvas']) {
    	localStorageImage = new Image();
        localStorageImage.src = localStorage['canvas'];
        ctx.drawImage(localStorageImage, 0, 0);
   }
}
	
  init();

}, false);
			
