let admin = require("firebase-admin");
const ug = require('ug');

let serviceAccount = require('./acckey');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://hotel-finder-e69a6.firebaseio.com/'
});
// Get a database reference to our posts
let db = admin.database();
let ref = db.ref("/hotels_new",);

const graph = new ug.Graph();

//create variables to store data
let hotels = [];
let cities = [];
let categories = [];
let ratings = [];
let countries = [];
let descriptions = [];
let states = [];
let sentimentals = [];

let location = [];
let state = [];
let country = [];
let description = [];
let category = [];
let rating = [];
let sentiment = [];

// quick and dirty function to get a node by rating
function getHotelNode(nodes, prop){
    return graph.nodes(nodes).query().filter({hotel_name: prop}).first();
}
function getCityNode(nodes, prop){
    return graph.nodes(nodes).query().filter({city: prop}).first();
}
function getCategoryNode(nodes, prop){
    return graph.nodes(nodes).query().filter({category: prop}).first();
}
function getRatingNode(nodes, prop){
    return graph.nodes(nodes).query().filter({rating: prop}).first();
}
function getCountryNode(nodes, prop){
    return graph.nodes(nodes).query().filter({country: prop}).first();
}
function getStateNode(nodes, prop){
    return graph.nodes(nodes).query().filter({state: prop}).first();
}
function getDescriptionNode(nodes, prop){
    return graph.nodes(nodes).query().filter({description: prop}).first();
}
function getSentimentNode(nodes, prop){
    return graph.nodes(nodes).query().filter({sentiment: prop}).first();
}


//fetch data
ref.orderByChild('Property_Name').once('value')
    .then((data)=>{
        let dat = data.val();
        console.log(data.numChildren());
        for (key in dat) {
            if(dat.hasOwnProperty(key)){
                //console.log(dat[key].hotel_name);
                if (hotels.includes(dat[key].Property_Name) === false) hotels.push(dat[key].Property_Name);
                if (cities.includes(dat[key].City) === false) cities.push(dat[key].City);
                if (categories.includes(dat[key].Property_Type) === false) categories.push(dat[key].Property_Type);
                if (ratings.includes(dat[key].Site_Review_Rating) === false) ratings.push(dat[key].Site_Review_Rating);
                if (countries.includes(dat[key].Country) === false) countries.push(dat[key].Country);
                if (descriptions.includes(dat[key].rating) === false) descriptions.push(dat[key].Hotel_Description);
                if (states.includes(dat[key].rating) === false) states.push(dat[key].State);
                if (sentimentals.includes(dat[key].Sentimental_Value) === false) sentimentals.push(dat[key].Sentimental_Value);


               /* location = {...{hotel_name: dat[key].hotel_name, city:dat[key].city} };
                category = {...{hotel_name: dat[key].hotel_name, city:dat[key].category} };
                rating = {...{hotel_name: dat[key].hotel_name, city:dat[key].rating} };*/
                let loc = {hotel_name: dat[key].Property_Name, location: dat[key].City};
                let cat = {hotel_name: dat[key].Property_Name, category: dat[key].Property_Type};
                let rat = {hotel_name: dat[key].Property_Name, rating: dat[key].Site_Review_Rating};
                let sta = {hotel_name: dat[key].Property_Name, state: dat[key].State};
                let coun = {hotel_name: dat[key].Property_Name, country: dat[key].Country};
                let des = {hotel_name: dat[key].Property_Name, description: dat[key].Hotel_Description};
                let sen = {hotel_name: dat[key].Property_Name, sentiment: dat[key].Sentimental_Value};
                location.push(loc);
                category.push(cat);
                rating.push(rat);
                state.push(sta);
                country.push(coun);
                description.push(des);
                sentiment.push(sen);
            }
        }
        return hotels, cities, categories, ratings,country,countries,description,descriptions,states,state, sentiment, sentimentals, location, category, rating;
    })
    .then(()=>{
        // Add to graph
        hotels.forEach(function(hotel) {
            graph.createNode('hotel', {hotel_name: hotel});
        });

        cities.forEach(function(city) {
            graph.createNode('city', {city: city});
        });

        categories.forEach(function(category) {
            graph.createNode('category', {category: category});
        });

        ratings.forEach(function(rating) {
            graph.createNode('rating', {rating: rating});
        });

        countries.forEach(function(country) {
            graph.createNode('country', {country: country});
        });

        descriptions.forEach(function(description) {
            graph.createNode('description', {description: description});
        });
        states.forEach(function(state) {
            graph.createNode('state', {state: state});
        });
        sentimentals.forEach(function(sentiment) {
            graph.createNode('sentiment', {sentiment: sentiment});
        });

    })
    .then(()=>{
        location.forEach(function(dat) {
            //console.log(getNode('category','Hotel'));
            //console.log(getNode('hotel', dat.hotel_name));
            graph.createEdge('location').link(
                getHotelNode('hotel', dat.hotel_name),
                getCityNode('city', dat.location)
            ).setDistance(1);
        });

        category.forEach(function(dat) {
            graph.createEdge('category').link(
                getHotelNode('hotel',dat.hotel_name),
                getCategoryNode('category',dat.category)
            ).setDistance(2);
        });

        rating.forEach(function(dat) {
            graph.createEdge('rating').link(
                getHotelNode('hotel',dat.hotel_name),
                getRatingNode('rating',dat.rating)
            ).setDistance(6);
        });

        state.forEach(function(dat) {
            graph.createEdge('state').link(
                getHotelNode('hotel',dat.hotel_name),
                getStateNode('state',dat.state)
            ).setDistance(4);
        });

        country.forEach(function(dat) {
            graph.createEdge('country').link(
                getHotelNode('hotel',dat.hotel_name),
                getCountryNode('country',dat.country)
            ).setDistance(8);
        });

        description.forEach(function(dat) {
            graph.createEdge('description').link(
                getHotelNode('hotel',dat.hotel_name),
                getDescriptionNode('description',dat.description)
            ).setDistance(7);
        });

        sentiment.forEach(function(dat) {
            graph.createEdge('sentiment').link(
                getHotelNode('hotel',dat.hotel_name),
                getSentimentNode('sentiment',dat.sentiment)
            ).setDistance(7);
        });

        return location, category, rating, state, country, description, sentiment;
    })
    .then(()=>{
        // save graph
        console.log(graph.nodeCount());
        console.log(graph.edgeCount());
        graph.save('./graph.ugd', function() {
            //doAfterSave();
            console.log('Graph saved into file');
            process.exit();
        });
    });










