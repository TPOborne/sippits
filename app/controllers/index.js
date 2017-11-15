module.exports = app => {
  const db = require('../helpers/database'),
        HomeModel = require('../models/home'),
        server = require('http').Server(app),
        io = require('socket.io')(server);

  /**
   * Application entry point
   */
  app.get('/', (req, res, next) => {
    res.render('pages/index');
  });

  /**
   * Joining an existing game
   */
  app.post('/join', (req, res, next) => {
    let data = {};
    let errors = {error: false, errorMsg: ""};
    let response = {errors: errors, data: data};
    let { gameCode, name } = req.body;

    if ( gameCode === '' || name === '' ) {
      response.errors.error = true;
      response.errors.errorMsg = "game code or name is empty";
      return res.send(response);
    }

    HomeModel.getActiveGameIdByCode(gameCode)
    .then(result => { 
      if ( result.length === 0 ) {
        response.errors.error = true;
        response.errors.errorMsg = "code not real";
        return res.send(response);
      } else {
        let gameId = result[0][0].game_id;
        return HomeModel.insertNewPlayer(gameId, name)
        .then(result => { 
          let data = {player_id: result[0].insertId, player_name: name, gameCode: gameCode, gameId: gameId};
          response.data = data;
          return res.send(response);
        })
      }
    })
    .catch(error => { 
      response.errors.error = true;
      response.errors.errorMsg = "catch";
      return res.send(response);
    })

  });

  /**
   * Get Players
   */
  app.post('/getPlayers', (req, res, next) => {
    let { gameCode, name } = req.body;
    HomeModel.getGameIdByCode(gameCode)
    .then(result => { 
      if ( result.length === 0 ) {
        return res.send('error: code not real');
      } else {
        let gameId = result[0][0].game_id;
        return HomeModel.getPlayerDataById(gameId)
        .then (result => {
          return res.send(result[0]);
        })
      }
    })
  });
  /**
   * Creating a new game
   */
  app.post('/create', (req, res, next) => {
    let data = {};
    let errors = {error: false, errorMsg: ""};
    let response = {errors: errors, data: data};
    let gameId = 0;
    let { gameCode, name } = req.body; 

    if ( gameCode === '' || name === '' ) {
      response.errors.error = true;
      response.errors.errorMsg = "one or more fields are blank";
      return res.send(response);
    }
    
    return HomeModel.getActiveGameIdByCode(gameCode)
      .then(result => { 
        console.log(result[0].length);
        if (result[0].length !== 0) {
          //create game
          response.errors.error = true;
          response.errors.errorMsg = "game code in use";
          return res.send(response);
        } else {
          return HomeModel.insertNewGame(gameCode)
          .then(result => {
            gameId = result[0].insertId;
            return HomeModel.insertNewPlayer(gameId, name);
          })
          .then(result => { 
            let data = {player_id: result[0].insertId, player_name: name, gameCode: gameCode, gameId: gameId};
            response.data = data;
            return res.send(response);
          })
        }
      })
      .catch(error => { 
        response.errors.error = true;
        response.errors.errorMsg = "catch";
        return res.send(respose);
      })
      
  });

}