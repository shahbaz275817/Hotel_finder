const express = require('express');
const path = require('path');
const router = express.Router();

const recomController = require('../Controllers/recom');
/* GET home page. */
//router.get('/:hotelName/:seq', recomController.getRecommendations);
router.get('/:hotelName/:seq', recomController.getGraphRecommendations);

module.exports = router;