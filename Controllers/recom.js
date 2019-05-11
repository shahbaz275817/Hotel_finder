var admin = require("firebase-admin");
const request = require('request');
const https = require('https');
var http = require("http");
var serviceAccount = require('../acckey');
const ug = require('ug');

let graph = new ug.Graph();

/*admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://hotel-finder-e69a6.firebaseio.com/'
});*/
var db = admin.database();
var ref = db.ref("/hotels_new",);


exports.getRecommendations = (req, res, next) => {
    hotelName = req.params.hotelName;
    seq = req.params.seq;
    console.log(seq);
    const body = JSON.stringify({
        hotel: hotelName
    });
    var postBody = {
        url: 'http://localhost:5000/api/',
        body: body,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length
        }
    };
    var hotels = {};
    request.post(postBody, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            //console.log(JSON.parse(body));
            val = JSON.parse(body);
            ref.orderByChild('hotel_name').equalTo(val['prediction'][seq]).once('value')
                .then(data=>{
                    hotels ={...data.val()};
                    return hotels;
                })
                .then(hotels=>{
                    res.render('recoms',{htls:hotels});
                })
        }
    });
};


/*exports.getRecommendations1 = (req, res, next) => {
    hotelName = req.params.hotelName;
    ref.orderByChild('hotel_name').once('value')
        .then(data=>{
            const body = JSON.stringify({
                hotel: hotelName
            });
            var postBody = {
                url: 'http://localhost:5000/api/',
                body: body,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': body.length
                }
            };
            var hotels = null;
            request.post(postBody, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    //console.log(JSON.parse(body));
                    val = JSON.parse(body);
                    allHotels=data.val();
                    for (i = 0; i < val['prediction'].length; i++) {
                        hotel = val['prediction'][i];
                        for (k in allHotels) {
                            if(allHotels.hasOwnProperty(k)){
                                if(hotel===allHotels[k].hotel_name){
                                   hotels = {...{k :allHotels[k]}}
                                }
                            }
                        }
                    }
                }
                console.log(hotels);
                return hotels;
            });
            request.end();
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};*/
function getHotelNode(nodes, prop){
    return graph.nodes(nodes).query().filter({hotel_name: prop}).first();
}
exports.getGraphRecommendations = (req, res, next) => {
    let hotelName = req.params.hotelName;
    let seq = req.params.seq;
    let hotels = [];
    // load graph from flat file into RAM
    graph.load('./graph.ugd', function() {

        //find the hotel node, traverse the graph and get recommendations
        // get the closest 'hotel' nodes, at a minimum depth (distance) of 1
        let node = getHotelNode('hotel',hotelName);
        let results = graph.closest(node, {
            compare: function(node) { return node.entity === 'hotel'; },
            minDepth: 1,
            count: 500
        });
        // results is now an array of Paths, which are each traces from your starting node to your result node...
        let resultNodes = results.map(function(path) {
            return path.end();
        });

        //console.log(resultNodes);

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


    });
};