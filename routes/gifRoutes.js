const express = require('express');
const gifController = require('../controllers/gifController');
const auth = require('../middleware/auth');
const cloudinary_config = require('../middleware/cloudinary');
const gifRouter = express.Router();

gifRouter.post('/gifs', auth, cloudinary_config, gifController);

module.exports = gifRouter;