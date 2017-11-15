function PlayerModel() {
	var self = this;
	self.start = false;
	self.gameCode = "";
	self.players = [];
}

function Player(playerDetails) {
	var self = this;
	self.id = playerDetails.player_id;
	self.name = playerDetails.player_name;
	self.gameCode = playerDetails.gameCode;
}


var playerModel = new PlayerModel();

require(['jquery', 'socketio'], function ($, io) {

	$(document).ready(function () {
		
		$('#joinGame').on('click', function (e) {
			e.preventDefault();
			
			var gameCode = $('#gameCode').val();
			var name = $('#name').val();

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
						console.log(player);
						$(".players").append('<li class="list-group-item" id="'+ player.player_id +'">' + player.player_name + '</li>');	
						playerModel.players.push(new Player(player));
					});
				}
			})

			$.ajax({
				url: '/join',
				type: 'post',
				data: data,
				success: function (response) {
					playerModel.start = true;
					playerModel.gameCode = data.gameCode;
					console.log(response);
					$(".gameCodeWR").text(gameCode);
					$(".loginContainer").slideUp();
					$(".waitingRoom").slideDown();
					socket.emit('sendAddPlayer', response);
				}
			})
		})

		$("#createGame").click(function (event) {
			event.preventDefault();
			var gameCode = $("#gameCode").val();
			var name = $("#name").val();
			var data = { gameCode: gameCode, name: name };
			$.ajax({
				url: "/create",
				type: "post",
				data: data,
				success: function (response) {
					console.log(response);
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
				$(".players").append('<li class="list-group-item" id="'+ data.player_id +'">' + data.player_name + '</li>');	
				playerModel.players.push(new Player(data));
			}
		}
	});
	
	socket.on('messages', function(data) {
		console.log(data);
	});


});
