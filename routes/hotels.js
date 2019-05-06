const express = require('express');
const router = express.Router();

var hotelController = require('../Controllers/hotel');



router.get('/recommendation/:hotelName',hotelController.getRecommendations);
router.get('/:hotelId', hotelController.getHotel);
router.get('/location/:city',hotelController.getHotelByLocation);
router.get('/getReviews/:hotelId',hotelController.getHotelReviews);
router.post('/save',hotelController.saveReviewsData);


module.exports = router;