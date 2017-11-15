const db = require('../helpers/database'),
    HomeModel = require('../models/home');

/**
 * Creating a new game
 */
exports.createGame = (details) => {      
    let data = {};
    let errors = {error: false, errorMsg: ""};
    let response = {errors: errors, data: data};
    let gameId = 0;
    let gameCode = details.gameCode;
    let name = details.name;

    if ( gameCode === '' || name === '' ) {
        response.errors.error = true;
        response.errors.errorMsg = "one or more fields are blank";
        return response;
    }

    return HomeModel.getActiveGameIdByCode(gameCode)
        .then(result => { 
        console.log(result[0].length);
        if (result[0].length !== 0) {
            //create game
            response.errors.error = true;
            response.errors.errorMsg = "game code in use";
            return response;
        } else {
            return HomeModel.insertNewGame(gameCode)
            .then(result => {
                gameId = result[0].insertId;
                return HomeModel.insertNewPlayer(gameId, name);
            })
            .then(result => { 
                let data = {player_id: result[0].insertId, player_name: name, gameCode: gameCode, gameId: gameId};
                response.data = data;
                return response;
            })
        }
    })
    .catch(error => { 
        response.errors.error = true;
        response.errors.errorMsg = "catch";
        return response;
    })
}

/**
 * Set Game in Progress
 */
exports.setGameInProgress = (details) => {
    return HomeModel.setGameInProgress(details.gameId);
}

/**
 * Get Players
 */
exports.getPlayers = (details) => { 
    return HomeModel.getGameIdByCode(details.gameCode)
    .then(result => { 
        if ( result.length === 0 ) {
            return 'code not real';
        } else {
            let gameId = result[0][0].game_id;
            return HomeModel.getPlayerDataById(gameId)
            .then (result => {
                return result[0];
            })
        }
    })
    .catch(error => { 
        return 'error catch';
    })
}

exports.joinGame = (details) => {
    let data = {};
    let errors = {error: false, errorMsg: ""};
    let response = {errors: errors, data: data};
    let gameCode = details.gameCode;
    let name = details.name;

    if ( gameCode === '' || name === '' ) {
        response.errors.error = true;
        response.errors.errorMsg = "game code or name is empty";
        return response;
    }

    return HomeModel.getActiveGameIdByCode(gameCode)
    .then(result => { 
        if ( result.length === 0 ) {
            response.errors.error = true;
            response.errors.errorMsg = "code not real";
            return response;
        } else {
            let gameId = result[0][0].game_id;
            return HomeModel.insertNewPlayer(gameId, name)
            .then(result => { 
                let data = {player_id: result[0].insertId, player_name: name, gameCode: gameCode, gameId: gameId};
                response.data = data;
                return response;
            })
        }
    })
    .catch(error => { 
        response.errors.error = true;
        response.errors.errorMsg = "catch";
        return response;
    })

}