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
      .then(gameData => {
        if ( !gameData || !gameData.game_id ) {
          return res.send('Invalid Game Code');
        }

        req.session.gameId = gameData.game_id;
        HomeModel.insertNewPlayer(gameData.game_id, name).then( () => { return res.send('success')} );
      })
  });

  app.get('/getPlayers', (req, res, next) => {
    let gameId = req.session.gameId;

    return HomeModel.getPlayerDataById(gameId)
      .then( result => {
        return res.send(JSON.stringify(result));
      })
    
  });

  app.post('/create', (req, res, next) => {
    let { gameCode, name } = req.body; 

    console.log(gameCode, name);

    if ( gameCode === '' || name === '' ) {
      return false;
    }

    db.query('SELECT game_id from games WHERE game_code = ? AND active = 1' , [gameCode])
      .then(result => {
        if (result.length > 0) {
          return res.send('Game with that code currently in use');
        } else {
          return db.query('INSERT INTO games (game_code) VALUES (?)', [gameCode])
          .then(() => {
            return db.query('SELECT game_id FROM games WHERE game_code = ?', [gameCode])
            .then(result => {
              let gameId = result[0].game_id;
              return db.query('INSERT INTO players (player_name, game_id) VALUES (?, ?)', [name, gameId])
              .then(() => {
                return res.send('success');
              })
            }) 
          })
        }
      })

  })
}