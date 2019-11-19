const express = require('express');
const articlesCtrl = require('../controllers/articlesController');
const auth = require('../middleware/auth');

const articleRouter = express.Router();

articleRouter.post('/articles', auth, articlesCtrl.createArticle);
articleRouter.get('/articles/:articleId', auth, articlesCtrl.getArticle);
articleRouter.patch('/articles/:articleId', auth, articlesCtrl.editArticle);
articleRouter.delete('/articles/:articleId', auth, articlesCtrl.deleteArticle);
articleRouter.post('/articles/:articleId/comment', auth, articlesCtrl.createComment);


module.exports = articleRouter;