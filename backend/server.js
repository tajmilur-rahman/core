require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./src/app/middleware/error-handler');
const environment = require('./src/environments/environment');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// api routes
app.use('/api/v1', require('./src/app/v1.app-routing'));

// global error handler
app.use(errorHandler);

// start server
const port = environment.server.port;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
