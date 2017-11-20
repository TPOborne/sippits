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
	self.charsList = [];
	self.myPlayerName = "";
	self.myCharacterName = "";
	self.sippit_count = "";
	self.targettedPlayerId = null;
	self.targettedSippitAmount = 0;
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
			event.preventDefault();
			$("#startGame").hide();
			var data = {gameId: gameModel.gameId, players: gameModel.players};
			socket.emit('s_startGame', data);
		});

		$("#enterNight").click(function (event) {
			event.preventDefault();
			$("#enterNight").hide();
			var data = {gameId: gameModel.gameId}
			socket.emit('s_enterNight', data);
		});

		$("#enterDay").click(function (event) {
			event.preventDefault();
			$("#enterDay").hide();
			var data = {gameId: gameModel.gameId}
			socket.emit('s_enterDay', data);
		});


		$(".targetPlayers").on("click", "li.chooseTargetPlayer", function(event) {
			event.preventDefault();
			gameModel.targettedPlayerId = $(this).attr("id");
			$(".targetPlayers").children().removeClass("target");
			$(this).addClass("target");
		});
		$(".targetSippits").on("click", "label.sippitBtn", function(event) {
			event.preventDefault();
			console.log($(this));
			if ($(this).hasClass("active")) {
				$(this).removeClass("active");
				gameModel.targettedSippitAmount = 0;
			} else {
				gameModel.targettedSippitAmount = $(this).attr("id");
				$(".targetSippits").children().removeClass("active");
				$(this).addClass("active");
			}
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
			gameModel.charsList = response.playerData.charsList;
			let playerData = response.playerData;
			for (i = 0; i < playerData.players.length; i++) { 
				if (playerData.players[i].id == gameModel.myPlayerId) {
					gameModel.myCharId = playerData.chars[i];
				}
			}
			gameModel.charsList.forEach(function(character) {
				if (character.character_id == gameModel.myCharId) {
					gameModel.myCharacterName = character.character_name;
				}
			});
			gameModel.day++;
			$(".dayMode > .playerInfo").text(nameFormat("Day " + gameModel.day));
			$(".dayMode > .title").text(nameFormat(gameModel.myPlayerName) + " the " + gameModel.myCharacterName);
			$(".nightMode > .title").text(nameFormat(gameModel.myPlayerName) + " the " + gameModel.myCharacterName);
			$(".waitingRoom").slideUp();
			$(".dayMode").slideDown();
			$(".playerInfo").text();
			if (gameModel.host == true) {
				setTimeout( function(){ 
					$("#enterNight").fadeIn();
				  }  , 0000 );
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
			gameModel.myPlayerName = response.data.player_name;
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
			gameModel.myPlayerName = response.data.player_name;
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
			gameModel.sippit_count++;		
			$(".sippit_cup").text(gameModel.sippit_count);
			$(".nightMode > .playerInfo").text(nameFormat("Night " + gameModel.day));
			$(".dayMode").slideToggle();
			$(".nightMode").slideToggle();
			//show list of players in targetPlayers
			if ($(".targetPlayers").children().length == 0) {
				gameModel.players.forEach(function (player) {
					if (player.id != gameModel.myPlayerId) {
						$(".targetPlayers").append('<li class="list-group-item chooseTargetPlayer" id="'+ player.id +'">' + player.name + '</li>');						
					}
				});			
			}

			$(".targetSippits > label").remove();
			
			var length = gameModel.sippit_count + 1;
			var percent = 100 / gameModel.sippit_count;
			if (length > 11) {
				length = 11;
				percent = 10;
			}
			for (i = 1; i < length; i++) { 
				$(".targetSippits").append('<label class="sippitBtn btn btn-primary" style="width: ' + percent + '%" id="' + i + '"><input type="checkbox">' + i + '</label>');
			}

			if (gameModel.host == true) {
				$("#enterDay").fadeIn();
			}
		}
	});

	socket.on('enterDay', function(response) {
		if (response.gameId == gameModel.gameId) {
			gameModel.day++;
			$(".dayMode > .playerInfo").text(nameFormat("Day " + gameModel.day));
			$(".nightMode").slideToggle();
			$(".dayMode").slideToggle();
			if (gameModel.host == true) {
				$("#enterNight").fadeIn();
			}

			//nothing after this (except resetting target amount)
			gameModel.targettedPlayerId = null;
			gameModel.targettedSippitAmount = 0;
			$(".targetPlayers").children().removeClass("target");
		}
	});
	
	socket.on('messages', function(data) {
		console.log(data);
	});

	function appendPlayer(data) {
		$(".players").append('<li class="list-group-item" id="'+ data.player_id +'">' + data.player_name + '</li>');	
		gameModel.players.push(new Player(data));
	}

	function nameFormat(string) {
		return string.replace(/\w\S*/g, function (word) {
			return word.charAt(0) + word.slice(1).toLowerCase();
		});
	}
	
});
