const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes');
const articleRouter = require('./routes/articleRouter');
// const gifRouter = require('./routes/gifRoutes');

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization');    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
    next();
  });


app.use('/api/v1/auth', userRouter);
app.use('/api/v1/resources', articleRouter);
// app.use('/api/v1/gifs', gifRouter);

module.exports = app;