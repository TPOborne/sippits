require(['jquery'], function ($) {

	var players = [],
		previousPlayers = [];

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
					response = response.trim();
					if (response === 'success') {
						$(".gameCodeWR").text(gameCode);
						$(".loginContainer").slideUp();
						$(".waitingRoom").slideDown();
						getPlayers();
					}
				}
			})
		})


		var getPlayers = function () {
			$.ajax({
				url: "/getPlayers",
				type: "get",
				contentType: "application/json",
				success: function (response) {
					var playersArray = JSON.parse(response);
					previousPlayers = players;
					players = [];
					playersArray.forEach(function (player) {
						players.push(new playerObj(player.player_id, player.player_name));
					});
					printPlayers();
				}
			});

		};


		var printPlayers = function () {
			if (previousPlayers.length == players.length) {
			} else {
				$(".players").empty();
				players.forEach(function (player) {
					$(".players").append('<li class="list-group-item">' + player.name + '</li>');
				});
			}
		}

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
					debugger;
					console.log(response);
				}
			});
		});


	});

});



// require(['jquery'], function($) {
//   var players = [];
//   var previousPlayers = [];

//   function playerObj(id, name) {
//     this.id = id;
//     this.name = name;
//   }

//   $(document).ready(function() {

//       $("#joinGame").click(function(event) {
//           debugger;
//           event.preventDefault();
//           var gameCode = $("#gameCode").val();
//           var name = $("#name").val();
//           var action = "joinGame";
//           var data = {action: action, gameCode: gameCode, name: name};
//           $.ajax({
//               url: "php/dbc.php",
//               type: "post",
//               data: data,
//               success: function (response) { 
//                   if (response == "success") {
//                       console.log(response);
//                       $(".gameCodeWR").text(gameCode);
//                       $(".loginContainer").slideUp();
//                       $(".waitingRoom").slideDown();
//                       getPlayers();
//                   } else {
//                       console.log("Error: " + response);
//                   }
//               }
//           });
//       });


//       var getPlayers = function() {
//           var action = "getPlayers";
//           var data = {action: action};
//           $.ajax({
//               url: "php/dbc.php",
//               type: "get",
//               data: data,
//               contentType: "application/json",
//               success: function (response) { 
//                   var playersArray = JSON.parse(response);
//                   previousPlayers = players;
//                   players = [];
//                   playersArray.forEach(function(player) {
//                       players.push(new playerObj(player.player_id, player.player_name));
//                   }); 
//                   printPlayers();
//               }
//           });

//       };

//       var printPlayers = function() {
//           if (previousPlayers.length == players.length) {  
//           } else {
//               $(".players").empty();
//               players.forEach(function(player) {
//                   $(".players").append('<li class="list-group-item">' + player.name+ '</li>');
//               });
//           }
//       }

//       $(".numb").click(function(event) {
//           console.log(players.length);
//       });

//       $("#createGame").click(function(event) {
//           event.preventDefault();
//           var gameCode = $("#gameCode").val();
//           var name = $("#name").val();
//           var action = "createGame";
//           var data = {action: action, gameCode: gameCode, name: name};
//           $.ajax({
//               url: "php/dbc.php",
//               type: "post",
//               data: data ,
//               success: function (response) {             
//                   console.log(response);
//               }
//           });
//       });

//       window.setInterval(function() {
//           getPlayers();
//       }, 1000);
//   });
// })





