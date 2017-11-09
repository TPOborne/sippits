module.exports = app => {
  const db = require('../helpers/database')
        HomeModel = require('../models/home');


  /**
   * Application entry point
   */
  app.get('/', (req, res, next) => {
    res.render('pages/index');
  });

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
        HomeModel.insertNewPlayer(gameId, name).then( () => { return res.send('success')} );
      })
  });

  app.get('/getPlayers', (req, res, next) => {
    let gameId = req.session.gameId;

    return HomeModel.getPlayerDataById(gameId)
      .then( result => {
        return res.send(JSON.stringify(result[0]));
      })
    
  });

  app.post('/create', (req, res, next) => {
    let { gameCode, name } = req.body; 

    if ( gameCode === '' || name === '' ) {
      return false;
    }

    HomeModel.getActiveGameIdByCode(gameCode)
      .then(result => { 
        if ( result[0].length > 0 ) {
          return Promise.reject('Game with that code currently in use');
        }
      })
      .then(() =>     { return HomeModel.addNewGameCode(gameCode) })
      .then(result => { return HomeModel.insertNewPlayer(result[0].insertId, name) })
      .then(() =>     { return res.send('success'); })
      .catch(error => { res.send(error); })
  })
}