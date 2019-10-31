const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', (req, res, next) => {
    res.status(200).json({"message": 'Express hello!'});
    next();
});


module.exports = app;