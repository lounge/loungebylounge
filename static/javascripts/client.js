var tool, context, body, canvas, wrapper, count, touchdown, socket, i, last = [], color, size, width, height;

$(document).ready(function() {
	
	body = $("body");
    canvas = $("#canvas");
	wrapper = $("#wrapper");
	count = $("div#sub_headline h3 span");
	
	context = canvas[0].getContext('2d');
	


	socket = io.connect();
	
	socket.on('msg', function(data) {
		drawCircle(data.circle, data.session_id);
	});
	socket.on('count', function(data) {
		count.html('People online (' + data.count + ')');
	});
	
	// The pencil tool instance.
  tool = new tool_pencil();

  // Attach the mousedown, mousemove and mouseup event listeners.
  canvas.bind('mousedown', ev_canvas, false);
  canvas.bind('mousemove', ev_canvas, false);
  canvas.bind('mouseup',   ev_canvas, false);


});

// This painting tool works like a drawing pencil which tracks the mouse 
// movements.
function tool_pencil () {
  var tool = this;
  this.started = false;

  // This is called when you start holding down the mouse button.
  // This starts the pencil drawing.
  this.mousedown = function (ev) {
      context.beginPath();
      context.moveTo(ev._x, ev._y);
      tool.started = true;
  };

  // This function is called every time you move the mouse. Obviously, it only 
  // draws if the tool.started state is set to true (when you are holding down 
  // the mouse button).
  this.mousemove = function (ev) {
    if (tool.started) {
      context.lineTo(ev._x, ev._y);
      context.stroke();
      
      circle = {
			x: ev._x,
			y: ev._y,
			color: "blue",
			size: 4	
		}
		
		drawCircle(circle);
		socket.send(circle);
    }
  };

  // This is called when you release the mouse button.
  this.mouseup = function (ev) {
    if (tool.started) {
      tool.mousemove(ev);
      tool.started = false;
    }
  };
}

// The general-purpose event handler. This function just determines the mouse 
// position relative to the canvas element.
function ev_canvas (ev) {
// if (ev.layerX || ev.layerX == 0) { // Firefox
//   ev._x = ev.layerX;
//   ev._y = ev.layerY;
// } else if (ev.offsetX || ev.offsetX == 0) { // Opera
//   ev._x = ev.offsetX;
//   ev._y = ev.offsetY;
// }
	ev._x = ev.clientX;
    ev._y = ev.clientY;

  // Call the event handler of the tool.
  var func = tool[ev.type];
  if (func) {
    func(ev);
  }
}




	
//	function receive(msg) {
//
//		if (msg.buffer) {
//			msg.buffer.forEach(receive);
//		}
//		
//		if (msg.reset) {
//			delete last[msg.session_id];
//		}
//
//		if (msg.clear) {
//			clearScreen();
//		}
//		
//		if (msg.circle) {
//			
//		}		
//		
//		if (msg.count) {
//			
//		}
//	}
//	
//	function clearScreen() {
//		context.clearRect(0,0,width,height)
//	}
//	
//	function clearLast() {
//		delete last["me"];
//		socket.send({reset:true});
//	}


		
	function drawCircle(circle, session_id) {

		//session_id = session_id || "me";

		context.lineTo(circle.x, circle.y);
      	context.stroke();
      	

		//last[session_id] = circle;		

	}
			
