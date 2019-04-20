const express = require('express');
const router = express.Router();

const indexController = require('../Controllers/index');
router.get('/', indexController.getIndex);
router.get('/offline',indexController.getOffline);
router.get('/offlineinfo',indexController.getOfflineinfo);
router.get('/all-hotel',indexController.getAllHotels);
module.exports = router;
