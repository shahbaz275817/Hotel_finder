const functions = require('firebase-functions');
var admin   = require('firebase-admin');
var cors = require('cors');

admin.initializeApp();
exports.saveHotelData = functions.https.onRequest((request,response)=>{
    {
        // cors((request,response)=>{
            return admin.database().ref('/hotels_new').push({
                id: Number( request.body.id),
                Additional_info:request.body.Additional_info,
                Address:request.body.Address,
                City:request.body.City,
                Country:request.body.Country,
                Hotel_Description:request.body.Hotel_Description,
                Hotel_Facilities:request.body.Hotel_Facilities,
                Locality:request.body.Locality,
                Latitude:parseFloat(request.body.Latitude),
                Longitude:parseFloat(request.body.Longitude),
                Pageurl:request.body.Pageurl,
                Point_of_interest:request.body.Point_of_interest,
                Property_Name:request.body.Property_Name,
                Property_Type:request.body.Property_Type,
                Province:request.body.Province,
                Room_Facilities:request.body.Room_Facilities,
                Room_Type:request.body.Room_Type,
                Site_Review_Rating:Number(request.body.Site_Review_Rating),
                Site_Stay_Review_Rating:request.body.Site_Stay_Review_Rating,
                State:request.body.State,
                Image_Url:request.body.Image_Url,
                Sentimental_Value:request.body.Sentimental_Value
            })
                .then(()=>{
                    return response.status(201).json({message:'data saved'})
                })
                .catch((err)=>{
                    return response.status(500).json({error:err})
                })
        // });
    }
});

