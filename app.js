const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
// const mysql_connection = require('./config/mysql_connection');
// const mongoose = require('mongoose');
// const config = require('./config/database');

// Connect To Database
// mongoose.Promise = require('bluebird');
// mongoose.connect(config.database, { useMongoClient: true, promiseLibrary: require('bluebird') })
//   .then(() => console.log(`Connected to database ${config.database}`))
//   .catch((err) => console.log(`Database error: ${err}`));

const app = express();

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json({limit: '50mb'}));

// const users = require('./routes/users');
const cms = require('./routes/cms');

// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
// app.use(bodyParser.json());

// Passport Middleware
// app.use(passport.initialize());
// app.use(passport.session());

// require('./config/passport')(passport);

// app.use('/users', users);

app.use('/api/cms', cms);

var router = require('./routes/pet');
app.use('/', router);

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});