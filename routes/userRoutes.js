const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/create-user', userController.signUp);

userRouter.post('/signin', userController.signIn);


module.exports = userRouter;