const express = require("express"),
  app = express(),
  path = require("path"),
  bodyParser = require("body-parser"),
  nunjucks = require("nunjucks"),
  session = require("express-session"),
  mysqlstore = require('express-mysql-session')(session),
  passport = require("passport"),
  cookieParser = require('cookie-parser'),
  flash = require("express-flash"),
  compression = require('compression'),
  fs = require("fs"),
  helmet = require("helmet"),
  mysql = require('mysql'),
  db = require('./helpers/database'),
  HomeModel = require('./models/home'),
  BrainModel = require('./models/brain'),
  server = require('http').Server(app),
  io = require('socket.io')(server);

if ( process.env.NODE_ENV !== 'production' ) {
  const dotenv = require('dotenv');
  dotenv.load(); // only for dev   
} else {
  app.use(compression());
}
const config = require("./config.js").get(process.env.NODE_ENV); // get config

app.set("views", __dirname + (process.env.NODE_ENV === 'production' ? '/views/min' : '/views')); // set views directory
app.set("port", config.port); // set port number


// configure view engine
nunjucks.configure(app.get("views"), {
  express: app,
  autoescape: true,
  noCache: true
}).addFilter('getFirstWord', (str, sep) => { 
  return (str.split(sep))[0];
});

app.use(helmet());

// configure static paths
app.use(express.static(path.join(__dirname, "./node_modules")));
app.use(express.static(path.join(__dirname, (process.env.NODE_ENV === 'production') ? "./public/dist/" : './public/' )));
// use session
app.use(cookieParser());

db.connect(config.db);


const sessionOptions = {
  secret: 'randomstrings',
  saveUninitialized: false,
  resave: false,
  store: new mysqlstore(config.db),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}

if ( process.env.NODE_ENV === 'production' ) {
  app.set("trust proxy", 1); // trust first proxy
  sessionOptions.cookie.secure = true;
}

app.use(session(sessionOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());

// db.connect(config.db);
// db.setupSchema();

// redirect to https if on http
if (process.env.NODE_ENV === "production") {
  app.all("*", (req, res, next) => {
    if (req.headers["x-forwarded-proto"] === "https") {
      return next(); // OK, continue
    }
    res.redirect("https://" + req.hostname + req.url);
  });
}
// set rendering engine and extension
app.engine("twig", nunjucks.render);
app.set("view engine", "twig");

app.get("*", (req, res, next) => {
  console.log("#################");
  console.log("ROUTE: ", req.url);
  console.log("METHOD: ", req.method);
  console.log("#################");  
  next();
});

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();  
})

// include routes dynamicallly from controllers folder
let routesDir = "./controllers/";
fs.readdirSync(routesDir).forEach(file => {
  if (file.charAt(0) !== ".") {
    let name = file.substr(0, file.indexOf("."));
    require(routesDir + name + ".js")(app);
  }
});

/**
 * 404 handler
 */
app.use(function(req, res, next) {
  res.status(404).sendFile('404.html', {root: `${__dirname}/views/pages/static/`});
});

/**
* error handler (500)
*/
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).sendFile('500.html', {root: `${__dirname}/views/pages/static/`});  
});

io.on('connection', function(client) {  
  console.log('Client connected...');

  client.on('s_join', function(data) {
    client.emit('messages', 'Hello from server');
  });

  client.on('s_addPlayer', function(data) {
    io.sockets.emit('addPlayer', data);
  });

  client.on('s_startGame', function(data) {
    BrainModel.setGameInProgress(data)
    .then( () => {
      BrainModel.generateCharacters(data)
      .then ( result => {
        console.log(result);
        let response = {gameData: data, playerData: result};
        io.sockets.emit('startGame', response);
      })
    });
  });

  client.on('s_createGame', function(data) {
    BrainModel.createGame(data)
    .then( result => {
      client.emit('createGame', result);
    });
  });

  client.on('s_getPlayers', function(data) {
    BrainModel.getPlayers(data)
    .then( result => {
      client.emit('getPlayers', result);
    });
  });

  client.on('s_joinGame', function(data) {
    BrainModel.joinGame(data)
    .then( result => {
      client.emit('joinGame', result);
    });
  });

  client.on('s_enterNight', function(data) {
    io.sockets.emit('enterNight', data);
  });

  client.on('s_enterDay', function(data) {
    io.sockets.emit('enterDay', data);
  });

});

// start server
server.listen(app.get("port"), () => {
  console.log(`Server running on port ${app.get("port")}`);
});
