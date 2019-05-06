const express = require('express');
const router = express.Router();

var userController = require('../Controllers/user');



router.get('/signin',userController.signIn);
router.get('/signup', userController.signUp);
router.post('/login',userController.login);
router.post('/signup',userController.createUser);
router.get('/signout',userController.signOut);

module.exports = router;