
/**
 * Module dependencies.
 */

var express = require('express')
    , app = express.createServer()
	, io = require('socket.io')
	, port = process.argv[2] || 80
	, buffer = []
	, count = 0
	, socket

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/static'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


// socket.io

socket = io.listen(app)

socket.sockets.on('connection', function(client) {
	
	count++;
	
	client.emit('count', {count:count, session_id: client.sessionId})
	client.broadcast.emit('count', {count:count, session_id: client.sessionId})
			
	// message
	client.on('message', function(circle) {
		
		var msg = {
			circle: circle,
			session_id: client.sessionId
		}

		buffer.push(msg)

		if (buffer.length > 1024) buffer.shift();

//		if (circle.clear) {
//			msg.clear = true;
//			msg.reset = true;
//			buffer = [];
//			delete msg.circle;
//		}
//
//		if (circle.reset) {
//			msg.reset = true;
//			delete msg.circle;
//		}

		client.emit('msg', msg);

	});
	
	client.on('disconnect', function(){
		count--;
        client.emit('count', {count: count, session_id: client.sessionId});
        client.broadcast.emit('count', {count:count, session_id: client.sessionId})
    });
    
});

