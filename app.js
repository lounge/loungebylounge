
// Module dependencies.

var express = require('express')
    , app = express.createServer()
	, io = require('socket.io')
	, port = process.argv[2] || 80
	, buffer = []
	, count = -1
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
    	title: 'loungebyloungé',
    	layout: 'layouts/main_layout'
  	});
});

app.use(function(req, res){
	res.render('errors/404', {
    	title: '404',
    	layout: 'layouts/main_layout'
    });
});

app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


// socket.io

socket = io.listen(app);

socket.sockets.on('connection', function(client) {
	
	client.emit('join', { 'clientId': client.id });	
	
	count++;
	
	if (count > 0) {
		client.emit('updateClients', { 'clients': count });
		client.broadcast.emit('updateClients', { 'clients': count });
	}
	
	client.on('drawStart', function(data) {
		console.log('tool', data.tool);
		console.log('tool', data.tool.started);
		console.log('tool', data.tool.draw);
		client.broadcast.emit('drawStart', data );
	});
			
	client.on('draw', function(data) {

		buffer.push(data.point)
		if (buffer.length > 1024) buffer.shift();
		
		client.broadcast.emit('draw', data);
		
		console.log(client.id);

	});
	
	client.on('drawEnd', function(data) {
		client.broadcast.emit('drawEnd', data);
	})
	
	client.on('disconnect', function(){
		count--;
        client.broadcast.emit('updateClients', { 'clients': count });
    });
    
});

