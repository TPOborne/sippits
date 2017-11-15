function GameModel() {
	var self = this;
	self.start = false;
	self.gameCode = "";
	self.gameId = "";
	self.host = false;
	self.players = [];
}

function Player(playerDetails) {
	var self = this;
	self.id = playerDetails.player_id;
	self.name = playerDetails.player_name;
}

var gameModel = new GameModel();

require(['jquery', 'socketio'], function ($, io) {

	$(document).ready(function () {
		
		$('#joinGame').on('click', function (e) {
			e.preventDefault();
			var gameCode = $('#gameCode').val().toUpperCase();
			var name = $('#name').val().toUpperCase();
			var data = {
				gameCode: gameCode,
				name: name
			}
			socket.emit('s_getPlayers', data);
			socket.emit('s_joinGame', data);
		})

		$("#createGame").click(function (event) {
			event.preventDefault();
			var gameCode = $("#gameCode").val().toUpperCase();
			var name = $("#name").val().toUpperCase();
			var data = { gameCode: gameCode, name: name };
			socket.emit('s_createGame', data);
		});

		$("#startGame").click(function (event) {
			var data = {gameId: gameModel.gameId};
			socket.emit('s_startGame', data);
		});

		
	});


	var socket = io.connect('http://localhost:5000/');

    socket.on('connect', function(data) {
		socket.emit('s_join', 'Hello World from client');
	});

	socket.on('addPlayer', function(data) {
		if (gameModel.start) {
			if (gameModel.gameCode == data.gameCode) {
				appendPlayer(data);
			}
		}
	});

	socket.on('startGame', function(data) {
		console.log(data);
		if (gameModel.gameId == data.gameId) {
			$(".waitingRoom").slideUp();
			$(".dayMode").slideDown();
		}
	});

	socket.on('createGame', function(response) {
		console.log(response);
		if ( response.errors.error == false ) {
			gameModel.start = true;
			gameModel.host = true;
			gameModel.gameCode = response.data.gameCode;
			gameModel.gameId = response.data.gameId;
			$(".gameCodeWR").text(gameModel.gameCode);
			$(".loginContainer").slideUp();
			$(".waitingRoom").slideDown();
			$("#startGame").fadeIn();
			appendPlayer(response.data);
		} else {
			console.log(response.errors.errorMsg);
		}
	});

	socket.on('getPlayers', function(response) {
		response.forEach(function(player){
			appendPlayer(player);
		});
	});

	socket.on('joinGame', function(response) {
		console.log(response);
		if ( response.errors.error == false ) {
			gameModel.start = true;
			gameModel.gameCode = response.data.gameCode;
			gameModel.gameId = response.data.gameId;
			$(".gameCodeWR").text(gameModel.gameCode);
			$(".loginContainer").slideUp();
			$(".waitingRoom").slideDown();
			socket.emit('s_addPlayer', response.data);
		} else {
			console.log(response.errors.errorMsg);
		}
	});
	
	socket.on('messages', function(data) {
		console.log(data);
	});

	function appendPlayer(data) {
		$(".players").append('<li class="list-group-item" id="'+ data.player_id +'">' + data.player_name + '</li>');	
		gameModel.players.push(new Player(data));
	}

});
