module.exports = app => {
  const db = require('../helpers/database');


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

    return db.query('SELECT * FROM games WHERE game_code = ?', [gameCode])
      .then( result => {
        let gameData = result[0];

        if ( !gameData || !gameData.game_id ) {
          return res.send('Invalid Game Code');
        }

        req.session.gameId = gameData.game_id;

        return db.query('INSERT INTO players (game_id, player_name) VALUES (?, ?)', [gameData.game_id, name])
          .then( () => {
            return res.send('success');
          })
      })
  });

  app.get('/getPlayers', (req, res, next) => {
    let gameId = req.session.gameId;

    db.query('SELECT * FROM players WHERE game_id = ?', [gameId])
      .then( result => {
        return res.send(JSON.stringify(result));
      });
  });

  app.post('/create', (req, res, next) => {
    let { gameCode, name } = req.body; 

    console.log(gameCode, name);

    if ( gameCode === '' || name === '' ) {
      return false;
    }

    return db.query('INSERT INTO games (game_code) VALUES (?)', [gameCode])
      .then(() => {
        return res.send('success');
      })
  })

  
}