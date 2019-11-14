const express = require('express');
const articlesController = require('../controllers/articlesController');
const auth = require('../middleware/auth');

const articleRouter = express.Router();

articleRouter.post('/articles', auth, articlesController);


module.exports = articleRouter;