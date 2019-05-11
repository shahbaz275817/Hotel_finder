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
    $.ajax('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&result_type=sublocality'+'&key=' + GOOGLE_MAP_KEY)
        .then(
        function success (response) {
            //console.log('User\'s Address Data is ', response);
            console.log(response);
            // console.log(response.results.length);
          if(response.results.length !== 0){
              // console.log("if");

              var filtered_city_array = response.results[0].address_components.filter(function(address_component){
                    return address_component.types.includes("administrative_area_level_2");
                });
                var city = filtered_city_array.length ? filtered_city_array[0].long_name: "";
                var filtered_sublocality_array = response.results[0].address_components.filter(function(address_component){
                    return address_component.types.includes("sublocality");
                });
                var sublocality = filtered_sublocality_array.length ? filtered_sublocality_array[0].long_name: "";
                var filtered_locality_array = response.results[0].address_components.filter(function(address_component){
                    return address_component.types.includes("locality");
                });
                var locality = filtered_sublocality_array.length ? filtered_locality_array[0].long_name: "";
                console.log(city+' '+sublocality+' '+locality);
                document.getElementById('city').innerHTML = sublocality+', '+locality;
                document.getElementById('loc').innerHTML = city;
                document.getElementById('loc1').innerHTML = sublocality;
            }
            else{
                // console.log("else");
              $.ajax('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&result_type=administrative_area_level_2'+'&key=' + GOOGLE_MAP_KEY)
                  .then(function success (response) {
                      console.log(response);
                      var filtered_city_array = response.results[0].address_components.filter(function(address_component){
                          return address_component.types.includes("administrative_area_level_2");
                      });
                      var city = filtered_city_array.length ? filtered_city_array[0].long_name: "";
                      console.log(city);
                      var filtered_state_array = response.results[0].address_components.filter(function(address_component){
                          return address_component.types.includes("administrative_area_level_1");
                      });
                      var state = filtered_state_array.length ? filtered_state_array[0].long_name: "";
                      document.getElementById('city').innerHTML = city+', '+state;
                      document.getElementById('loc').innerHTML = city;
                      document.getElementById('loc1').innerHTML = state;

                  });

               /*area = response.plus_code.compound_code.split(" ")[1].trim();
                city = response.plus_code.compound_code.split(",")[1].trim();
                console.log(area+' '+city);
                document.getElementById('city').innerHTML = area+' '+city;
                document.getElementById('loc').innerHTML = city;
                document.getElementById('loc1').innerHTML = area;*/
           }

            $(".choose").hide();
            $(".search_button").show();
        },
        function fail (status) {
            console.log('Request failed.  Returned status of',
                status)
        }
    );

    /*$.ajax({
        url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+latitude + ',' + longitude +'&radius=1000&type=sublocality&key=AIzaSyANp71IsdgL5MJU_0lcsci-aZ-mrA9vGrU',
        type: "GET",
        dataType: 'jsonp',
        cache: false,
        success: function(response){
            console.log(response);
        }
    })*/
}

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

    let index =0;
    if(navigator.onLine){
        for(let i=index;i<index+15;i++){
            $.get( "/hotel/location/"+document.getElementById("loc").innerText.split(" ")[0]+"/"+document.getElementById("loc1").innerText+'/'+i, function( data,textStatus, xhr ) {
                $(".grid").append(data);
                $(".search_button").hide();
                console.log(xhr);
            });
        }
    }
    else{
        $.get( "/offlineinfo", function( data ) {
            $(".offline").empty().append(data);
        });
    }



    // $.get( "/hotel/location/"+document.getElementById("loc").innerText.split(" ")[0]+"/"+document.getElementById("loc1").innerText.split(" ")[0], function( data ) {
    //     $(".grid").append(data);
    //     $(".search_button").hide();
    // });
});


