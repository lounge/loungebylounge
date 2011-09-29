var tool, color, context, canvas, socket;

$(document).ready(function() {
	
	socket = io.connect("http://127.0.0.1:443");	
	
	socket.on('msg', function(data) {
		drawCircle(data.circle);
	});
	
	socket.on('count', function(data) {
		$("div#sub_headline h3 span").html('People online (' + data.count + ')');
	});
	
	
	canvas = $('#canvas');
	context = canvas[0].getContext('2d');
	
  	tool = new tool_pencil();

  	canvas.bind('mousedown', ev_canvas, false);
  	canvas.bind('mousemove', ev_canvas, false); 
  	canvas.bind('mouseup',   ev_canvas, false);
  	
  	$('#clear').bind('click', clear_canvas);
  	
  	$('#color').bind('click', function() {
  		color = randomize_color();
  	})



function tool_pencil () {
	var tool = this;
	this.started = false;
	
	color = randomize_color();

 	this.mousedown = function (ev) {
		context.beginPath();
		context.moveTo(ev._x, ev._y);
        tool.started = true;
    };

    this.mousemove = function (ev) {
    	if (tool.started) {
      
      		circle = {
				x: ev._x,
				y: ev._y,
				color: 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')',
				size: 4	
			};
		
			draw_circle(circle);
			socket.emit('draw', { 'circle': circle });
    	}
    };

  	this.mouseup = function (ev) {
    	if (tool.started) {
      		tool.mousemove(ev);
      		tool.started = false;
    	}
  	};
  
}

function ev_canvas (ev) {
	if (ev.clientY || ev.clientX == 0) {
		ev._x = ev.clientX - this.offsetLeft;
	    ev._y = ev.clientY - this.offsetTop;
	}

	var func = tool[ev.type];
    if (func) {
    	func(ev);
    } 
}

function draw_circle(circle) {
	context.lineTo(circle.x, circle.y);
	context.strokeStyle = circle.color;
	context.lineWidth = circle.size;
	context.stroke();	
}

function clear_canvas() {
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, canvas.width(), canvas.height());
	context.restore();
}

function randomize_color() {
	
	color = {
		r: Math.round(Math.random() * 255),
		g: Math.round(Math.random() * 255),
		b: Math.round(Math.random() * 255)
	};
	
	return color;
}
	
});
			
