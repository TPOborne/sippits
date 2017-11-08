let config = {
  default: {
    host: "localhost",
    port: process.env.PORT,
    db: {
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    },
  },
  production: {
    host: 'rhul-lets.herokuapp.com',
    port: process.env.PORT,
    db: {
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USERNAME,
      database: process.env.DB_NAME
    },
  }
}

let commonConfig = {

}

/**
 * Getter method that returns config based on environment variable ie. production or development
 * @param env - environment
 */
exports.get = env => {
  let configToUse = config[env] || config.default;
  return Object.assign(configToUse, commonConfig); //merger of both objects
}