// singleton pattern
const mysql = require('mysql'),
      fs = require('fs');

let DBInstance = null;

/**
 * Initialise connection to database
 * @param {*} url 
 * @param {*} done 
 */
exports.connect = (config) => {
  if ( DBInstance ) return DBInstance;
  DBInstance = mysql.createPool(config);
}

/**
 * Getter method to return database
 */
exports.get = () => {
  if ( !DBInstance ) throw new Error('DB Pool has not been initialized');

  return DBInstance;
}


/**
 * Close connection to database
 * @param done 
 */
exports.close = (done) => {
  if ( !DBInstance ) {
    DBInstance.end( err => console.log('Connection closed') );
  }
}

// /**
//  * Sets up all the tables required for this application
//  */
// exports.setupSchema = () => {
//   let Schema = require('../models/schema');
//   Object.keys(Schema).forEach( key => {
//     let currentSchema = Schema[key];
//       currentSchema = currentSchema.trim();

//     exports.get().query(currentSchema, (err, results, fields) => {
//       if ( err ) throw err;
//       console.log(`${key} Schema created`);
//     });

//   });
// }

/**
 * Asychronous version of db.query 
 * Returns a promise 
 */
exports.query = (query, params) => {
  return new Promise( (resolve, reject) => {
    exports.get().query(query, params, (err, result, fields) => {
      if ( err ) {
        reject(err);
      }
      resolve([result || [], fields || []]);
      // resolve( ((result) && (result.length > 0)) ? result : '');
    });
  });
}

