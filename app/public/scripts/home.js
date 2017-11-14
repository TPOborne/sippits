function PlayerModel() {
	var self = this;
	self.players = [];
}

function Player(playerDetails) {
	var self = this;
	self.id = playerDetails.id;
	self.name = playerDetails.name;
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
				url: '/join',
				type: 'post',
				data: data,
				success: function (response) {
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
					if ( response != 'error' ) {
						$(".gameCodeWR").text(gameCode);
						$(".loginContainer").slideUp();
						$(".waitingRoom").slideDown();
						socket.emit('sendAddPlayer', response);
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
		$(".players").append('<li class="list-group-item" id="'+ data.id +'">' + data.name + '</li>');	
		playerModel.players.push(new Player(data));
	});
	
	socket.on('messages', function(data) {
		console.log(data);
	});


});
