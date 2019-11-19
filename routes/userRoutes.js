const express = require('express');
const userController = require('../controllers/userController');
const isAdmin = require('../middleware/isAdmin');

const userRouter = express.Router();

userRouter.post('/create-user', isAdmin, userController.signUp);

userRouter.post('/signin', userController.signIn);


module.exports = userRouter;