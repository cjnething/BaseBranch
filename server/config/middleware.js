// Server-Side Middleware
// ----------------------
//
// The middleware connects the Express server app with the Express routers and configures the Express app to use additional modules such as body-parser, and morgan.

// User authentication
var passport = require('passport');
// Used for flash messages stored in session
var flash = require('connect-flash');
// Allows for parsing of cookies
var cookieParser = require('cookie-parser');
// Allows for parsing of POST request body.
var bodyParser  = require('body-parser');
// Allows for sessions in Express
var session = require('express-session');
// Allows for cross-origin requests
var cors = require('cors');
// Error logging and handling helper functions.
var helpers = require('./helpers.js'); 
// Logs requests sent from the client.
var morgan = require('morgan');

module.exports = function (app, express) {

  // Create Express routers for each type of route.
  var channelRouter = express.Router();
  var nodeRouter = express.Router();
  var resourceRouter = express.Router();
  var commentRouter = express.Router();
  var curriculumRouter = express.Router();
  var userRouter = express.Router();

  // configure passport by sending to passport.js file
  require('./passport.js')(passport);

  // Associate the Express server app with the different modules that it should use.
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(session({secret: 'whatasecret', resave: false, saveUninitialized: false}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(express.static(__dirname + '/../../client/dist'));
  app.use(cors());
  app.use(morgan('dev'));
  app.use(helpers.logErrors);
  app.use(helpers.handleErrors);

  // Connect request paths to appropriate Routers
  app.use('/api/channel', channelRouter);
  app.use('/api/node', nodeRouter);
  app.use('/api/resource', resourceRouter);
  app.use('/api/comment', commentRouter);
  app.use('/api/curriculum', curriculumRouter);
  app.use('/api/user', userRouter);

  // Inject our Express routers into their respective route files.
  require('../channels/channelRoutes.js')(channelRouter);
  require('../nodes/nodeRoutes.js')(nodeRouter);
  require('../resources/resourceRoutes.js')(resourceRouter);
  require('../comments/commentRoutes.js')(commentRouter);
  require('../curricula/curriculumRoutes.js')(curriculumRouter);
  require('../users/userRoutes.js')(userRouter, passport);
};
