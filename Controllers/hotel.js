var admin = require("firebase-admin");

var serviceAccount = require('../acckey');

/*admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://hotel-finder-e69a6.firebaseio.com/'
});*/
var db = admin.database();
var ref = db.ref("/hotels_new",);


exports.getHotel = (req,res,next)=>{
    const hotelId = req.params.hotelId;
    //console.log(hotelId);
    ref.orderByChild('id').equalTo(Number(hotelId)).once('value')
        .then(data=> {
            //console.log(data.val());
            res.render('hotel-details', {
                htls: data.val(),
                pageTitle: 'Hotel Details',
                path: '/hotel/'
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getRecommendations = (req,res,next)=>{
    //console.log(req.params.hotelName);
    console.log("test");
};

exports.getHotelByLocation = (req,res,next)=>{
    const city = req.params.city.trim();

    ref.orderByChild('City').startAt(city).endAt(city+"\\uf8ff").limitToFirst(15).once('value')
      .then(data=>{
          res.render('includes/hotelLoc',{
              htls: data.val(),
          });
      }).catch((err)=>{
        console.log(err);
    })
};
