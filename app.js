var CONFIG = {
			gameStarted: false,
			players: [],
			groups: [],
			currentPlayer: "#"
		};

// Module dependencies.

var express = require('express')
	, everyone
	, port
    , app = express.createServer()
	, nowjs = require("now")
	, buffer = []
	, count = -1


// Configuration

app.settings.env = 'production';

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false })
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/static'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  port = process.argv[2] || 1337
  everyone = require("now").initialize(app);
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  port = process.argv[2] || 80
  everyone = require("now").initialize(app, {socketio: {transports: ['xhr-polling', 'jsonp-polling']}});
});


// Routes

app.get('/', function(req, res){
	res.render('index', {
    	title: 'loungebyloungé'
    	//layout: 'layouts/main_layout'
  	});
});

app.get('/sign-in', function(req, res){
	res.render('lobby/partials/menu', { title: 'loungebyloungé' });
});

app.get('/lobby', function(req, res){
	res.render('lobby/lobby', { 'players': CONFIG.players });
});

app.get('/play-menu', function(req, res){
	res.render('game/partials/menu');
});

app.get('/play', function(req, res){
	res.render('game/game');
});

app.use(function(req, res){
	res.render('errors/404', {
    	title: '404'
    	//layout: 'layouts/main_layout'
    });
});

app.listen(port);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);



// Connect

everyone.now.signIn = function() {
	
	//this.now.join({ 'user': this.user });	
	
	user = {
		nick: this.now.name,
		id: this.user.clientId	
	};
	
	CONFIG.players.push(user);
	
	everyone.now.updatePlayers({ 'players': CONFIG.players, 'gameStarted': CONFIG.gameStarted });
	
//	if (CONFIG.players.length > 1) {
//		everyone.now.updatePlayers({ 'players': CONFIG.players, 'gameStarted': CONFIG.gameStarted });
//		
//		if (!CONFIG.gameStarted)
//			startGame();
//	} 
};



// Lobby Events



everyone.now.createGroup = function (data) {
  var g = nowjs.getGroup(data.group);
  
  console.log('create group: ' + g.groupName);
  
  g.addUser(this.user.clientId);
 
  for (var i = 0; i < data.list.length; i++) {
  	nowjs.getClient(data.list[i], function() { this.now.setCurrentGroup(this.user.clientId); });
    g.addUser(data.list[i]);
  }
  
  
  
  
  CONFIG.groups.push(g);
  
  nowjs.getGroup(data.group).getUsers(function (users) {
	  for (var i = 0; i < users.length; i++) console.log('create: ' + users[i]);
	});
};

everyone.now.sendInvitation = function(data) {
	var inviter = this.now.name;
	var inviterId = this.user.clientId;
	
	for (var i = 0; i < data.length; i++) {
		nowjs.getClient(data[i], function() { this.now.receiveInvitation({ 'inviterId': inviterId, 'inviter': inviter }); });
	}
};

everyone.now.sendInvitationResponse = function(data) {
	nowjs.getClient(data.inviter, function() { this.now.receiveInvitationResponse({ 'response': data.response, 'id': data.id }); });
};






// Game Events

everyone.now.playMove = function(data) {
	var index;
	var nextPlayer;	
	var currentPlayer = this.user.clientId;
	
	console.log('currentGroup: ' + data.group);
	
	nowjs.getGroup(data.group).getUsers(function(users) {
		
		console.log('group found');
		
		for (var i = 0; i < users.length; i++) {
			
			console.log('user: ' + users[i] + ' current: ' + currentPlayer);
			
			if (users[i] == currentPlayer) {
				console.log('match');
				index = i;
			}
		}
		
		if (index == users.length - 1) {
			console.log('users i last, get first');
			nextPlayer = users[0];
		} else {
			console.log('users is not last, get next');
			nextPlayer = users[index + 1];
		}
		
	});
	
	console.log('next player: ' + nextPlayer);
		
	nowjs.getClient(nextPlayer, function() {
		this.now.setYourTurn();
	});
};

everyone.now.initGame = function(data) {
	
	nowjs.getGroup(data.group).getUsers(function (users) {
	  for (var i = 0; i < users.length; i++) console.log('init: ' + users[i]);
	});
	
	nowjs.getGroup(data.group).now.clientInitGame(data);
};

everyone.now.startGame = function(data) {
	
	nowjs.getGroup(data.group).now.setGameStarted(data.group);
	 
	nowjs.getClient(data.group, function() {
		this.now.setYourTurn(true);
	});
};

everyone.now.endGame = function(data) {
	//CONFIG.gameStarted = false;
	
	nowjs.getGroup(data.group).now.setGameEnded();
};






// Draw Events

everyone.now.drawStart = function(data) {
	nowjs.getGroup(data.group).now.clientDrawStart(data);
};
			
everyone.now.draw = function(data) {
	buffer.push(data.point)
	if (buffer.length > 1024) buffer.shift();
		
	nowjs.getGroup(data.group).now.clientDraw(data);
};
	
everyone.now.drawEnd = function(data) {
	nowjs.getGroup(data.group).now.clientDrawEnd(data);
};

everyone.now.changeBackground = function(data) {
	nowjs.getGroup(data.group).now.clientChangeBackground(data);
};

everyone.now.clearCanvas = function(data) {
	nowjs.getGroup(data.group).now.clientClearCanvas();
};



// Disconnect

nowjs.on('disconnect', function(){
	CONFIG.players.splice(CONFIG.players.indexOf(this.user.clientId), 1);
	
    //everyone.now.updatePlayers({ 'players': CONFIG.players, 'gameStarted': CONFIG.gameStarted });
    
//    if (CONFIG.players.length <= 1 && CONFIG.gameStarted) 
//		endGame();
});









