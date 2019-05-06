var admin = require("firebase-admin");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyANp71IsdgL5MJU_0lcsci-aZ-mrA9vGrU",
    authDomain: "hotel-finder-e69a6.firebaseapp.com",
    databaseURL: "https://hotel-finder-e69a6.firebaseio.com",
    projectId: "hotel-finder-e69a6",
    storageBucket: "hotel-finder-e69a6.appspot.com",
    messagingSenderId: "123908080478",
    appId: "1:123908080478:web:3ab154d0e713320d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// As httpOnly cookies are to be used, do not persist any state client side.
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

exports.signIn = (req,res,next)=>{
    res.render('login',
        {
            pageTitle: 'Login',
            path: '/user/signin',
            message: null,
            isAuthenticated: req.session.isLoggedIn
        })
};

exports.signUp = (req,res,next)=>{
    res.render('signup',
        {
            pageTitle: 'Sign up',
            path: '/user/signup',
            message: null,
            isAuthenticated: req.session.isLoggedIn
        })
};

exports.login = (req,res,next) =>{
    console.log(req.body.password);
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
        .then(user=>{
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken=>{
                    const expiresIn = 60 * 60 * 24 * 5 * 1000;
                    admin.auth().createSessionCookie(idToken.toString(), {expiresIn})
                        .then((sessionCookie) => {
                            // Set cookie policy for session cookie.
                            const options = {maxAge: expiresIn, httpOnly: true, secure: true};
                            res.cookie('session', sessionCookie, options);
                            req.session.isLoggedIn = true;
                            req.session.userEmail = req.body.email;
                            res.render('index',
                                {
                                    title: 'Hotel Finder',
                                    pageTitle: 'Home',
                                    path: '/',
                                    message: "Logged in successfully",
                                    isAuthenticated: req.session.isLoggedIn
                                });
                            res.end(JSON.stringify({status: 'success'}));
                        }, error => {
                            console.log(error);
                        });
                })
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
        });
    /*admin.auth().getUserByEmail(req.body.email)
        .then(function(userRecord) {
            // console.log('Successfully fetched user data:', userRecord.toJSON());
            res.render('login',
                {
                    pageTitle: 'Log in',
                    path: '/user/signin',
                    message: "Logged in successfully"
                })
        })
        .catch(function(error) {
            console.log('Error fetching user data:', error);
        });*/
};

exports.signOut = (req,res,next)=>{
    req.session.isLoggedIn = false;
    firebase.auth().signOut().then(function() {
        res.render('index',{title:'Hotel Finder',
            pageTitle: 'Express App',
            path: '/',
            message: "signed out successfully",
            isAuthenticated: req.session.isLoggedIn})
    }).catch(function(error) {
        console.log(error);
    });
};

exports.createUser = (req,res,next) =>{
    admin.auth().createUser({
        email: req.body.email,
        emailVerified: false,
        password: req.body.password,
        disabled: false
    })
        .then(function(userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            // console.log('Successfully created new user:', userRecord.uid);
            res.render('signup',
                {
                    pageTitle: 'Sign up',
                    path: '/user/signup',
                    message: "User created successfully",
                    isAuthenticated: req.session.isLoggedIn
                })
        })
        .catch(function(error) {
            res.render('signup',
                {
                    pageTitle: 'Sign up',
                    path: '/user/signup',
                    message: "User created failed",
                    isAuthenticated: req.session.isLoggedIn
                })
        });
};