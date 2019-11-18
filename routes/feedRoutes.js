const express = require('express');
const feedCtrl = require('../controllers/feedController');
const auth = require('../middleware/auth');

const feedRouter = express.Router();

feedRouter.get('/feed', auth, feedCtrl);

module.exports = feedRouter;