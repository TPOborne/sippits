function PlayerModel() {
	var self = this;
	self.start = false;
	self.gameCode = "";
	self.host = false;
	self.players = [];
}

function Player(playerDetails) {
	var self = this;
	self.id = playerDetails.player_id;
	self.name = playerDetails.player_name;
}

var playerModel = new PlayerModel();

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

			$.ajax({
				url: '/getPlayers',
				type: 'post',
				data: data,
				success: function (response) {
					response.forEach(function(player){
						appendPlayer(player);
					});
				}
			})

			$.ajax({
				url: '/join',
				type: 'post',
				data: data,
				success: function (response) {
					if ( response.errors.error == false ) {
						playerModel.start = true;
						playerModel.gameCode = data.gameCode;
						$(".gameCodeWR").text(gameCode);
						$(".loginContainer").slideUp();
						$(".waitingRoom").slideDown();
						socket.emit('sendAddPlayer', response.data);
					} else {
						console.log(response.errors.errorMsg);
					}
				}
			})
		})

		$("#createGame").click(function (event) {
			event.preventDefault();
			var gameCode = $("#gameCode").val().toUpperCase();
			var name = $("#name").val().toUpperCase();
			var data = { gameCode: gameCode, name: name };
			$.ajax({
				url: "/create",
				type: "post",
				data: data,
				success: function (response) {
					if ( response.errors.error == false ) {
						playerModel.start = true;
						playerModel.gameCode = data.gameCode;
						playerModel.host = true;
						$(".gameCodeWR").text(gameCode);
						$(".loginContainer").slideUp();
						$(".waitingRoom").slideDown();
						$("#startGame").fadeIn();
						socket.emit('sendAddPlayer', response.data);
					} else {
						console.log(response.errors.errorMsg);
					}
				}
			});
		});

		
	});


	var socket = io.connect('http://localhost:5000/');
    socket.on('connect', function(data) {
		socket.emit('join', 'Hello World from client');
	});

	socket.on('addPlayer', function(data) {
		if (playerModel.start) {
			if (playerModel.gameCode == data.gameCode) {
				appendPlayer(data);
			}
		}
	});
	
	socket.on('messages', function(data) {
		console.log(data);
	});

	function appendPlayer(data) {
		$(".players").append('<li class="list-group-item" id="'+ data.player_id +'">' + data.player_name + '</li>');	
		playerModel.players.push(new Player(data));
	}

});
