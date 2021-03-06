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
            return result;
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


exports.getActiveGameIdByCode = (gameCode) => {
    return db.query('SELECT game_id FROM games WHERE game_code = ? AND active = 1', [gameCode])
        .then(result => { return result });
}

exports.insertNewGame = (gameCode) => {
    return db.query('INSERT INTO games (game_code) VALUES (?)', [gameCode]);
}

exports.setGameInProgress = (gameId) => {
    return db.query('UPDATE games SET in_progress = 1 WHERE game_id = (?)', [gameId]);
}

exports.getAllCharacters = () => {
    return db.query("SELECT * FROM characters");
}

exports.assignCharToPlayer = (charId, playerId) => {
    return db.query('UPDATE players SET character_id = ? WHERE player_id = ?', [charId, playerId]);
}

