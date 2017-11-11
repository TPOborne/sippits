require(['jquery', 'socketio'], function ($, io) {

	var players = [];

	function playerObj(id, name) {
		this.id = id;
		this.name = name;
	}

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
					$(".players").append('<li class="list-group-item">' + data.name + '</li>');
					socket.emit('newPlayerJoin', data);
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
					if ( response ) {
						$(".gameCodeWR").text(gameCode);
						$(".loginContainer").slideUp();
						$(".waitingRoom").slideDown();
						$(".players").append('<li class="list-group-item">' + data.name + '</li>');
						//add p
					}
				}
			});
		});

		socket.on('refreshPlayers', function(data) {
			console.log("received refreshPlayers");
			$(".players").append('<li class="list-group-item">' + data.name + '</li>');		
			console.log(players.length);
		});
		socket.on('addPlayer', function(data) {
			players.push(new playersObj(data.id, data.name));
			console.log(players);
		});
	});

	

	var socket = io.connect('http://localhost:5000/');
    socket.on('connect', function(data) {
		socket.emit('join', 'Hello World from client');
	});
	
	socket.on('messages', function(data) {
		console.log(data);
	});


	/**
	 * new player joins on client
	 * client sends event 
	 * server receives event
	 * server gets new player
	 * server responds with nam
	 * 
	 */

});
