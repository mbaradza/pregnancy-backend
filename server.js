require('dotenv').config()
const express = require('express');
const app = express();
const config = require('./config');
const routes = require('./router');
const mongoose = require('mongoose');
const bot = require('./api/services/bot.service')
const messageService = require("./api/services/message.service");
const cronServices = require('./api/helper/messagesCronJob');
const http2 = require('./node_modules/http2');
require('express-http2-workaround')({ express:express, http2:http2, app:app });
const fs = require("fs");
var httpsOptions = {
  'key' : fs.readFileSync(__dirname +'/keys/server.key'),
  'cert' : fs.readFileSync(__dirname +'/keys/server.crt'),
  'ca' : fs.readFileSync(__dirname +'/keys/server.crt')
};

// Connecting to database
mongoose.connect(config.mongo.url, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(r =>{
  console.log('Database Connected...');
}).catch(r =>{ console.log('Database Not Connected!!', r)});

routes.register(app);
const server = http2.createServer(httpsOptions,app);
//SEND MESSAGES
cronServices.sendMessagesAtSeven();
cronServices.sendMessagesAtEleven();
cronServices.sendMessagesAtThree();
cronServices.updateIntervalDayEnd();
cronServices.updateIntervalMorning();

// Listening to port
server.listen(3001,async () => {
 await messageService.uploadMessages();
  console.log('Server running on localhost:3001');
});


module.exports = app;
