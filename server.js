var express = require('express')
    , app = express.createServer()
    , events = require('events')
	, io = require('socket.io')
	, port = 80
	, buffer = []
	, count = 0
	, socket
	
var emitter = new events.EventEmitter(); 
emitter.once('test', function() { });
emitter.setMaxListeners(0); 

app.configure(function() {
	app.register('.html', require('jade'));
	app.use(express.logger())
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
	app.use('/static', express.static(__dirname + '/static'))
});

app.get('/', function(req, res) {
	res.render(__dirname + '/src/index.html', { layout: false });
});




app.listen(port)

socket = io.listen(app)

socket.on('connection', function(client) {
	
	count++;
	
	client.send({
		buffer: buffer,
		count: count
	});

	client.broadcast({count:count, session_id: client.sessionId})
			
	// message
	client.on('message', function(circle) {
		
		var msg = {
			circle: circle,
			session_id: client.sessionId
		}

		buffer.push(msg)

		if (buffer.length > 1024) buffer.shift();

		if (circle.clear) {
			msg.clear = true;
			msg.reset = true;
			buffer = [];
			delete msg.circle;
		}

		if (circle.reset) {
			msg.reset = true;
			delete msg.circle;
		}

		client.broadcast(msg);

	});
	
	client.on('disconnect', function(){
		count--;
        client.broadcast({count: count, session_id: client.sessionId});
    });
    
});