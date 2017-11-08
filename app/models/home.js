const db = require('../helpers/database');


exports.getPlayerDataById = (gameId) => {
    return db.query('SELECT * FROM players WHERE game_id = ?', [gameId])
        .then(result => {
            return result;
        })
}

exports.getGameIdByCode = (gameCode) => {
    return db.query('SELECT game_id FROM games WHERE game_code = ?', [gameCode])
        .then( result => {
            return result[0];
        });
}

exports.insertNewPlayer = (gameId, playerName) => {
    return db.query('INSERT INTO players (game_id, player_name) VALUES (?, ?)', [gameId, playerName]);
}


// return db.query('SELECT game_id FROM games WHERE game_code = ?', [gameCode])
// .then( result => {
//   let gameData = result[0];

//   if ( !gameData || !gameData.game_id ) {
//     return res.send('Invalid Game Code');
//   }

//   req.session.gameId = gameData.game_id;

//   return db.query('INSERT INTO players (game_id, player_name) VALUES (?, ?)', [gameData.game_id, name])
//     .then( () => {
//       return res.send('success');
//     })
// })