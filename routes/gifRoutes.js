const express = require('express');
const gifCtrl = require('../controllers/gifController');
const auth = require('../middleware/auth');
const cloudinary_config = require('../middleware/cloudinary');
const gifRouter = express.Router();

gifRouter.post('/gifs', auth, cloudinary_config, gifCtrl.createGif);
gifRouter.get('/gifs/:gifId', auth, gifCtrl.getGif);
gifRouter.delete('/gifs/:gifId', auth, gifCtrl.deleteGif);
gifRouter.post('/gifs/:gifId/comment', auth, gifCtrl.createComment);

module.exports = gifRouter;