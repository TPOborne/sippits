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

exports.getGameCodeById = (gameId) => {
    return db.query('SELECT game_code FROM games WHERE game_id = ?', [gameId])
        .then( result => {
            return result[0];
        });
}

exports.insertNewPlayer = (gameId, playerName) => {
    return db.query('INSERT INTO players (game_id, player_name) VALUES (?, ?)', [gameId, playerName]);
}
