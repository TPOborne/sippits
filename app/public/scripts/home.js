function GameModel() {
	var self = this;
	self.start = false;
	self.gameCode = "";
	self.gameId = "";
	self.host = false;
	self.players = [];
	self.day = 0;
	self.myPlayerId = 0;
	self.myCharId = 0;
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
		});

		$("#createGame").click(function (event) {
			event.preventDefault();
			var gameCode = $("#gameCode").val().toUpperCase();
			var name = $("#name").val().toUpperCase();
			var data = { gameCode: gameCode, name: name };
			socket.emit('s_createGame', data);
		});

		$("#startGame").click(function (event) {
			var data = {gameId: gameModel.gameId, players: gameModel.players};
			socket.emit('s_startGame', data);
		});

		$("#enterNight").click(function (event) {
			var data = {gameId: gameModel.gameId}
			socket.emit('s_enterNight', data);
		});

		$("#enterDay").click(function (event) {
			var data = {gameId: gameModel.gameId}
			socket.emit('s_enterDay', data);
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

	socket.on('startGame', function(response) {
		let gameData = response.gameData;
		if (gameModel.gameId == gameData.gameId) {
			let playerData = response.playerData;
			for (i = 0; i < playerData.players.length; i++) { 
				if (playerData.players.id == gameModel.myPlayerId) {
					gameModel.myCharId = playerData.chars[i];
				}
			}
			$(".waitingRoom").slideUp();
			$(".dayMode").slideDown();
			gameModel.day++;
			$(".title").text("Day " + gameModel.day);
			if (gameModel.host == true) {
				$("#enterNight").fadeIn();
			}
		}
	});

	socket.on('createGame', function(response) {
		console.log(response);
		if ( response.errors.error == false ) {
			gameModel.start = true;
			gameModel.host = true;
			gameModel.gameCode = response.data.gameCode;
			gameModel.gameId = response.data.gameId;
			gameModel.myPlayerId = response.data.player_id;
			$(".title").text(gameModel.gameCode);
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
			gameModel.myPlayerId = response.data.player_id;
			$(".title").text(gameModel.gameCode);
			$(".loginContainer").slideUp();
			$(".waitingRoom").slideDown();
			socket.emit('s_addPlayer', response.data);
		} else {
			console.log(response.errors.errorMsg);
		}
	});

	socket.on('enterNight', function(response) {
		if (response.gameId == gameModel.gameId) {
			$(".title").text("Night " + gameModel.day);
			$(".dayMode").slideUp();
			$(".nightMode").slideDown();
			if (gameModel.host == true) {
				$("#enterDay").fadeIn();
			}
		}
	});

	socket.on('enterDay', function(response) {
		if (response.gameId == gameModel.gameId) {
			gameModel.day++;
			$(".title").text("Day " + gameModel.day);
			$(".nightMode").slideUp();
			$(".dayMode").slideDown();
			if (gameModel.host == true) {
				$("#enterNight").fadeIn();
			}
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
