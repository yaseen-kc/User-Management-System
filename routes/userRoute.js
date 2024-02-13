const express = require('express');
const userRoute = express();

const userController = require('../controller/userController');

userRoute.get('/register', userController.loadRegister);

module.exports = userRoute;