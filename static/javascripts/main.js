//$(document).ready(function() {
//	
//	function init() {
//		
//	}	
//
//	init();
//
//}, false);
//


//var LBL = {}
Main = (function() {
	
	var store = window.localStorage;
	
	CONFIG = {
		user: {},
		currentGroup: "#"
	}
	
	return {
	
		init: function() {
			
			now.updatePlayers = function(data) {
				$('#players-online').text('People online (' + (data.players.length) + ')');
			};
			
			now.setCurrentGroup = function(data) {
				CONFIG.currentGroup = data;
			};
			
			now.receiveInvitation = function(data) {
				$('#wrapper').prepend('<div id="invitation" clientid="' + data.inviterId + '">' +
									  	data.inviter + ' wants to play with you' +
									  	'<span id="accept">accept</span><span id="decline">decline</span>' +
									  '</div>');
			};
			
			now.receiveInvitationResponse = function(data) {
				var declineCount = 0;
				var responseCount = $('#wait-list ul li').length;
				
				$('#wait-list ul li[clientid="' + data.id + '"]').removeClass('pending').addClass(data.response);
				
				$('#wait-list ul li').each(function() {
					if ($(this).hasClass('pending'))
						responseCount--;
					if ($(this).hasClass('declined'))
						declineCount++;
				});
				
				
				if (declineCount == $('#wait-list ul li').length) {
					alert('all declined');
				}
				else if (responseCount == $('#wait-list ul li').length) {
					$('#send-invitation').hide();
					$('#start-game').css('display', 'block');
				}
			};
			
			now.clientInitGame = function(data) {
				CONFIG.currentGroup = data;
				
				$.ajax({
				   type: "GET",
				   url: "/play-menu",
				   success: function(res){
				     $('#main-list').replaceWith(res);
				     
				     $.ajax({
					   type: "GET",
					   url: "/play",
					   success: function(res){
					     $('#content').replaceWith(res);
					     Game.init();
						 now.startGame(CONFIG.currentGroup);
					   }
					});
					
				   }
				});
				
				
			};
			
			
			
			$('#sign-in a').click(function() {
				$('#sign-in').toggleClass('active');
			});
			
			$('span#sign-in').click(function() {
				now.name = $('#nickname').val();
				now.signIn();
				
				$.ajax({
				   type: "GET",
				   url: "/sign-in",
				   success: function(res){
				     $('ul#menu').replaceWith(res);
				   }
				});
			});
			
			$('#lobby a').live('click', function() {
				$.ajax({
				   type: "GET",
				   url: "/lobby",
				   success: function(res){
				     $('#content').replaceWith(res);
				   }
				});
			});
			
			$('#online-list ul li').live('mouseover',function(){
			    $(this).draggable({ revert: 'invalid' });
			});
			
			
			$('#drop').live('mouseover',function(){
				$(this).droppable({
					drop: function(event, ui) {
						$(ui.draggable).appendTo('#wait-list ul')
							.css('position', 'inherit')
							
						$('#wait-list').css('display', 'block');
						$('#send-invitation').css('display', 'block');
							//now.addPlayer($(ui.draggable).attr('clientid'));
					},
					activeClass: 'drop-active',
					hoverClass: 'drop-hover',
					greedy: true		
				});
			});
			
			$('#send-invitation').live('click', function() {
				var list = [];
				
				$('#wait-list ul li').each(function() {
					list.push($(this).attr('clientid'));
					$(this).addClass('pending');
				});
				
				now.sendInvitation(list);
			});
			
			$('#start-game').live('click', function() {
				var list = [];
				
				$('#wait-list ul li.accepted').each(function() {
					list.push($(this).attr('clientid'));
				});
				
				CONFIG.currentGroup = now.core.clientId;
								
				now.createGroup({ 'group': CONFIG.currentGroup, 'list': list });
				
				now.initGame({ 'group': CONFIG.currentGroup });
			});
			
			$('#invitation #accept').live('click', function() {
				var inviter = $(this).parent().attr('clientid');
				
				now.sendInvitationResponse({ 'response': 'accepted', 'inviter': inviter, 'id': now.core.clientId });
				$('#invitation span').remove();
				$('#invitation').html('Waiting for game to start');
			});
			
			$('#invitation #decline').live('click', function() {
				var inviter = $(this).parent().attr('clientid');
				
				now.sendInvitationResponse({ 'response': 'declined', 'inviter': inviter, 'id': now.core.clientId });
				$('#invitation').remove();
			});
		}
	}
}());


Main.init();
