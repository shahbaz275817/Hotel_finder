$( document ).ready(function() {

    $.get( "/hotel/getReviews/"+(document.getElementById("hotel_id").value).toString(), function( data ) {
        $(".reviews").append(data);
    });

});