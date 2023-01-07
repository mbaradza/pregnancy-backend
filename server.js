require('dotenv').config()
var fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({limit: '20mb', extended: true});
const config = require('./config');
const routes = require('./router');
const mongoose = require('mongoose');
const sessionConfig = require('./helper/sessionConfig.js');
const session = require('express-session');
const swaggerJsdoc = require('swagger-jsdoc');
const http = require("http");
const messageService = require("./api/services/message.service");
//Sessions Config
app.use(session(sessionConfig))

app.use(express.urlencoded({extended: false}));

//Enable CORS
app.use(cors());

// Bordy parser
app.use(bodyParser.json({limit: '20mb'}));
app.use(urlencodedParser);
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(function (err, req, res, next) {
  console.log('This is the invalid field ->', err.field, req.body, req.files)
  next(err)
})

//Swagger Definition
const swaggerUi = require('swagger-ui-express');

//Please Do Not Use In Production
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: 'Pregnancy Prayer APIS',
      version: '1.0.0',
      description: 'Backend For Pregnancy Prayer',
    },
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./api/**/**.js'],
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


const logRequestStart = (req, res, next) => {
  console.info(`${req.method} ${req.originalUrl}`);
  next()
};


app.use(logRequestStart);

// Connecting to database
mongoose.connect(config.mongo.url, {useNewUrlParser: true, useCreateIndex: true}).then(r =>{
  console.log('Database Connected...');
}).catch(r =>{ console.log('Database Not Connected!!', r)});

routes.register(app);

const server = http.createServer(app);


// Listening to port
server.listen(3001, () => {
  messageService.uploadMessages();
  console.log('Server running on localhost:3001');
});


module.exports = app;
