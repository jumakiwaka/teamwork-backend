const express = require('express');
const gifCtrl = require('../controllers/gifController');
const auth = require('../middleware/auth');
const cloudinary_config = require('../middleware/cloudinary');
const gifRouter = express.Router();

gifRouter.post('/gifs', auth, cloudinary_config, gifCtrl.createGif);
gifRouter.delete('/gifs/:gifId', auth, gifCtrl.deleteGif);

module.exports = gifRouter;