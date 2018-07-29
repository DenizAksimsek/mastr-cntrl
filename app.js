const express = require('express');
require('dotenv').config();
const path = require('path');
const favicon = require('serve-favicon');
const config = require(__dirname + '/config');
const github = config.github;
const api = config.api;
const app = express();
const helmet = require('helmet');
const logger = require(__dirname + '/app/functions/bunyan');
const port = api.port;
const isDev = app.get('env') === 'development';
const routes  = require(__dirname + '/routes/routes.js');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

app.set('views', path.join(__dirname + '/views'));
app.use(helmet());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(favicon(path.join(__dirname, 'public', '/images/favicon.ico')));
app.use(express.json());
app.use('/', routes);

/*eslint-disable-next-line no-process-env */
const server = app.listen(process.env.PORT || 3000, function() {
    logger.info('Mastr Cntrl Online Port:%s...', server.address().port);
});
