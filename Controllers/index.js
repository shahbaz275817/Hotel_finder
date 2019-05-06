var admin = require("firebase-admin");

var serviceAccount = require('../acckey');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://hotel-finder-e69a6.firebaseio.com/'
});
var db = admin.database();
var ref = db.ref("/hotels_new",);

//const Hotels = require('../models/hotels');

const ITEMS_PER_PAGE = 6;

//hotels = new Hotels();

exports.getIndex =  (req, res, next) => {

    res.render('index', {
        title:'Hotel Finder',
        pageTitle: 'Express App',
        path: '/',
        message: null,
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.getOffline = (req,res,next)=>{
    res.render('offline',{
        pageTitle: 'N/W Offline',
        path: '/offline',
        isAuthenticated: req.session.isLoggedIn
    })
};
exports.getOfflineinfo = (req,res,next)=>{
    res.render('offlineinfo',{
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.getAllHotels = (req,res,next) => {
    const page = +req.query.page || 1;
    let totalItems=0;
    ref.once('value')
        .then(data => {
            totalItems = data.numChildren();
        }).then(()=> {
            ref.orderByChild('id').startAt((page-1)*ITEMS_PER_PAGE).endAt(((page-1)*ITEMS_PER_PAGE)+ITEMS_PER_PAGE-1).once('value',)
                .then((dt) => {
                    var hotels =dt.val();
                    /*for (key in hotels) {
                         if(hotels.hasOwnProperty(key)){
                             console.log(key + " -> " + hotels[key].id);
                         }
                    }*/
                    // console.log(hotels);
                    res.render('all-hotel', {
                        htls: hotels,
                        title:'Hotel Finder',
                        pageTitle: 'Express App',
                        path: '/hotels',
                        currentPage: page,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                        isAuthenticated: req.session.isLoggedIn
                    });
                })
        }
    )

        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};