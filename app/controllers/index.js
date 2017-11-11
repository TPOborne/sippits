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
    let { gameCode, name } = req.body;

    if ( gameCode === '' || name === '' ) {
      return false;
    }

    return HomeModel.getGameIdByCode(gameCode)
      .then(result => {
        if ( result.length === 0 ) {
          return res.send('Invalid Game Code'); 
        }
        let gameId = result[0].game_id;
        req.session.gameId = gameId;

        HomeModel.insertNewPlayer(gameId, name)
          .then(result => { 
            return getPlayerData(result[0].insertId, name);
          })
          .catch(error => { 
            res.send('something went wrong with join'); 
          })          
      })
  });

  /**
   * Creating a new game
   */
  app.post('/create', (req, res, next) => {
    let { gameCode, name } = req.body; 

    if ( gameCode === '' || name === '' ) {
      return false;
    }
    
    return HomeModel.getActiveGameIdByCode(gameCode)
      .then(result => { 
        if ( result.length === 0 ) {
          return res.send('Game with that code currently in use');
        }
      })
      .then(() => { 
        return HomeModel.insertNewGame(gameCode)
      })
      .then(result => { 
        return HomeModel.insertNewPlayer(result[0].insertId, name)
      })
      .then(result => { 
        let data = getPlayerData(result[0].insertId, name)
        return res.send(client.emit('addPlayers', data))
      })
      
      .catch(error => { 
        res.send(error); 
      })
  });

  let getPlayerData = (id, name) => {
    return { id: id, name: name };
  }
}