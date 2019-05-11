var admin = require("firebase-admin");
const ug = require('ug');

let graph = new ug.Graph();
var serviceAccount = require('../acckey');

/*admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://hotel-finder-e69a6.firebaseio.com/'
});*/
var db = admin.database();
var ref = db.ref("/hotels_new");


exports.getHotel = (req,res,next)=>{
    const hotelId = req.params.hotelId;
    //console.log(hotelId);

    ref.orderByChild('id').equalTo(Number(hotelId)).once('value')
        .then(data=> {
            //console.log(data.val());
            res.render('hotel-details', {
                htls: data.val(),
                pageTitle: 'Hotel Details',
                path: '/hotel/',
                isAuthenticated: req.session.isLoggedIn
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

function getLocalityNode(nodes, prop){
    return graph.nodes(nodes).query().filter({locality: prop}).first();
}
function getCityNode(nodes, prop){
    return graph.nodes(nodes).query().filter({city: prop}).first();
}

exports.getHotelByLocation = (req,res,next)=>{
    const city = req.params.city.trim();

    /*ref.orderByChild('City').startAt(city).endAt(city+"\\uf8ff").limitToFirst(15).once('value')
      .then(data=>{
          res.render('includes/hotelLoc',{
              htls: data.val(),
          });
      }).catch((err)=>{
        console.log(err);
    });*/

    ////////////////////////////////////////////
    let locality = req.params.sublocality.trim();
    let queryParam =locality+', '+city;
    let seq = req.params.seq;
    let hotels = [];
    // load graph from flat file into RAM
    graph.load('./graph.ugd', function() {

        let node = getLocalityNode('locality',queryParam);
        if (node===null || node === undefined)
            node = getCityNode('city',city);
        if (node===null || node === undefined){
            console.log("fallback");
            ref.orderByChild('City').startAt(city).endAt(city+"\\uf8ff").limitToFirst(15).once('value')
                .then(data=>{
                    res.status = 204;
                    res.render('includes/hotelLoc',{
                        htls: data.val(),
                    },function (err) {
                        console.log(err);
                        res.render('includes/nohotels');
                    });
                }).catch((err)=>{
                console.log(err);
            });
            return;
        }
        let results = graph.closest(node, {
            compare: function(node) { return node.entity === 'hotel'; },
            minDepth: 1,
            count: 250
        });
        // results is now an array of Paths, which are each traces from your starting node to your result node...
        let resultNodes = results.map(function(path) {
            return path.end();
        });

        resultNodes.forEach(node=>{
            hotels.push(node.get('hotel_name'));
        });

        ref.orderByChild('Property_Name').equalTo(hotels[seq]).once('value')
            .then(data=>{
                hotels ={...data.val()};
                return hotels;
            })
            .then(hotels=>{
                res.render('recoms',{htls:hotels});
            })
            .catch(err=>{
                console.log(err);
            })


    });
    ///////////////////////////////////////////
};

exports.saveReviewsData = (request,response)=>{

    ref = db.ref("/hotel_reviews");
    return ref.push({
        id: Number(request.body.id),
        Rating:Number(request.body.Rating),
        Review:request.body.Review,
    })
        .then(()=>{
            return response.status(201).json({message:'data saved'})
        })
        .catch((err)=>{
            return response.status(500).json({error:err})
        })
};

exports.getHotelReviews = (request,response,next) =>{
    const hotelId = request.params.hotelId;
    console.log(hotelId);
    db.ref('hotel_reviews').orderByChild('id').equalTo(Number(hotelId)).once('value')
        .then(data=> {
            response.render('reviews', {
                reviews: data.val(),
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};