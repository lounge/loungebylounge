var CONFIG = {
			gameStarted: false,
			players: [],
			currentPlayer: "#"
		};

// Module dependencies.

var express = require('express')
    , app = express.createServer()
	, nowjs = require("now")
	, port = process.argv[2] || 80
	, buffer = []
	, count = -1


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


// now.js

var everyone = require("now").initialize(app, {socketio: {transports: ['xhr-polling', 'jsonp-polling']}});


// Connect

nowjs.on('connect', function() {
	
	this.now.join({ 'clientId': this.user.clientId });	
	
	CONFIG.players.push(this.user.clientId);
	
	if (CONFIG.players.length > 1) {
		everyone.now.updatePlayers({ 'players': CONFIG.players, 'gameStarted': CONFIG.gameStarted });
		
		if (!CONFIG.gameStarted)
			startGame();
	} 
});


// Game Events

everyone.now.playMove = function() {
	var index;	
	
	for (var i = 0; i < CONFIG.players.length; i++) {
		if (CONFIG.players[i] == CONFIG.currentPlayer) {
			index = i;
		}
	}

	if (index == CONFIG.players.length - 1) {
		CONFIG.currentPlayer = CONFIG.players[0];
	} else {
		CONFIG.currentPlayer = CONFIG.players[index + 1];
	}
		
	nowjs.getClient(CONFIG.currentPlayer, function() {
		this.now.yourTurn();
	});
};






// Draw Events

everyone.now.drawStart = function(data) {
	everyone.now.clientDrawStart(data);
};
			
everyone.now.draw = function(data) {
	buffer.push(data.point)
	if (buffer.length > 1024) buffer.shift();
		
	everyone.now.clientDraw(data);
};
	
everyone.now.drawEnd = function(data) {
	everyone.now.clientDrawEnd(data);
};

everyone.now.changeBackground = function(data) {
	everyone.now.clientChangeBackground(data);
};

everyone.now.clearCanvas = function() {
	everyone.now.clientClearCanvas();
};



// Disconnect

nowjs.on('disconnect', function(){
	CONFIG.players.splice(CONFIG.players.indexOf(CONFIG.currentPlayer), 1);
	
    everyone.now.updatePlayers({ 'players': CONFIG.players, 'gameStarted': CONFIG.gameStarted });
    
    if (CONFIG.players.length <= 1 && CONFIG.gameStarted) 
		endGame();
});





// Game Functions

function startGame() {
	CONFIG.gameStarted = true;
	everyone.now.startGame();
	
	CONFIG.currentPlayer = CONFIG.players[0];
	 
	nowjs.getClient(CONFIG.currentPlayer, function() {
		this.now.yourTurn();
	});
}

function endGame() {
	CONFIG.gameStarted = false;
	everyone.now.endGame();
}

