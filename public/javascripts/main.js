let deferredPrompt;
let GOOGLE_MAP_KEY ='AIzaSyDSGN8F5VFzSmapM9n14fCHI7NAx3SCaYk';

$(document).ready(()=>{
    $(".search_button").hide();
});


window.addEventListener('beforeinstallprompt', (e) => {
    //e.preventDefault();
    // Stash the event so it can be triggered later.
    //deferredPrompt = e;
    console.log('bip fired');
});

const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
    backdrop.style.display = 'none';
    sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
    backdrop.style.display = 'block';
    sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);

function getAddress (latitude, longitude) {
    $.ajax('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&result_type=administrative_area_level_2'+'&key=' + GOOGLE_MAP_KEY)
.then(
        function success (response) {
            //console.log('User\'s Address Data is ', response[0]);
            var filtered_array = response.results[0].address_components.filter(function(address_component){
                return address_component.types.includes("administrative_area_level_2");
            });
            var city = filtered_array.length ? filtered_array[0].long_name: "";
            //alert('city: ' + city.toLowerCase());
            document.getElementById('city').innerHTML = city;
            $(".choose").hide();
            $(".search_button").show();
        },
        function fail (status) {
            console.log('Request failed.  Returned status of',
                status)
        }
    )
};

$(".location_button").click(function(){
    var startPos;
    var nudge = document.getElementById("nudge");

    var showNudgeBanner = function() {
        nudge.style.display = "block";
    };

    var hideNudgeBanner = function() {
        nudge.style.display = "none";
    };

    var nudgeTimeoutId = setTimeout(showNudgeBanner, 5000);

    var geoSuccess = function(position) {
        hideNudgeBanner();
        clearTimeout(nudgeTimeoutId);

        startPos = position;
        getAddress(startPos.coords.latitude, startPos.coords.longitude);
    };
    var geoError = function(error) {
        switch(error.code) {
            case error.TIMEOUT:
                showNudgeBanner();
                break;
        }
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    $(this).hide();
});

$(".search_button").click(function () {
    $.get( "/hotel/location/"+document.getElementById("city").innerText.split(" ")[0], function( data ) {
        $(".grid").append(data);
        $(".search_button").hide();
    });
});


