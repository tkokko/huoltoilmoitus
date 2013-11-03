<!-- GLOBAL(!) variables -->

var g_infoWin = new google.maps.InfoWindow();

var g_map;
var g_myMarker;

var g_myLat = null;
var g_myLng = null;




$(document).ready(function() {
 
<!-- Map  -->

initialize();
locate();


function initialize() {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng( 61.5, 23.7667 ),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  g_map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}



// Gets the best geolocation available
function locate() {

    // google loader will provide an approximate location
    // based on the network IP address exposed by the mobile operator gateway
    // see http://code.google.com/apis/ajax/documentation/#ClientLocation
    if (typeof(google.loader.ClientLocation) != 'undefined') {
        try {
            g_myLat = google.loader.ClientLocation.latitude;
            g_myLng = google.loader.ClientLocation.longitude;
	    var location = new google.maps.LatLng( g_myLat, g_myLng);

	    createMyMarker( location );

	    return true;
 
        } catch (e) {}
    }

    // W3C geolocation API provides an accurate location from on-device GPS if available (e.g. iPhone OS3.0+)
    // see http://dev.w3.org/geo/api/spec-source.html
    // note: this is an asynchronous API that returns success or failure after device &/or user response
    if (typeof(navigator.geolocation) != 'undefined') {
        try {
            navigator.geolocation.getCurrentPosition(function(position) {
                // success - geolocation authorized by user. relocate the map.
                g_myLat = position.coords.latitude;
                g_myLng = position.coords.longitude;
		var location = new google.maps.LatLng( g_myLat, g_myLng)

		createMyMarker( location );

		return true;

            }, function() {
                // fail - geolocation denied by user. do nothing.
            });
        } catch (e) {}
    } 

   return false;

}

function createMyMarker( location ) {
	g_map.setOptions({
 		center: location,
		zoom: 14
	});

	//set the marker
	g_myMarker = new google.maps.Marker({
                    position: location,
                    map: g_map,
                    title: "My location",
                    icon: "/img/my_smiley.png",
                    draggable:true,
                    animation: google.maps.Animation.DROP
	});

	google.maps.event.addListener(g_myMarker, 'dragend', function(evt)
	{
		g_myLat = evt.latLng.lat().toFixed(3);
                g_myLng = evt.latLng.lng().toFixed(3);
	});

	hideTrackingInfo();
}

function hideTrackingInfo(){
	$("#trackingInfo").hide();	
}


  dpd.messages.on('create', function(message) {
    renderMessage(message);
  });

  dpd.messages.get(function(messages) {
    if (messages) {
      messages.forEach(function(m) {
        renderMessage(m);
      });
    }
  });

  $('#send-btn').click(sendMessage);

  function renderMessage(message) {
    //var $el = $('<li>');
    //$el.append('<strong>' + message.sender + ': </strong>');
    //$el.append(message.message);
    //$el.appendTo('#chatbox');

    var location = new google.maps.LatLng( message.location[0], message.location[1] );

    var marker = new google.maps.Marker({
                    position: location,
                    map: g_map,
                    title: message.sender,
                    icon: "/img/smiley.png"
    });

    var iwContent = "<h1>" + message.sender + "</h1><p>" + message.message + "</p>";

    google.maps.event.addListener(marker, 'click', function () {
    	g_infoWin.setContent(iwContent);
    	g_infoWin.open(g_map, marker);
    }); 

  }

  function sendMessage() {
    var sender = $('#screen-name').val();
    var msg = $('#message').val();

    dpd.messages.post({
      sender: sender,
      message: msg,
      location: [ g_myLat, g_myLng ]
    }, function(message, err) {
      if (err) {
        if (err.message) {
          alert(err.message);
        } else if (err.errors) {
          var errors = "";
          if (err.errors.sender) {
            errors += err.errors.sender + "\n";
          } 
          if (err.errors.message) {
            errors += err.errors.message + "\n";
          } 
          alert(errors);
        }
      } else {

        //$('#message').val('');

	g_myMarker.setMap(null);

	$( "#form-area" ).hide( "slow", function() {
    		$( "#done" ).show();
  	});

	//sendToJira( sender, msg, [ g_myLat, g_myLng ] );

      }
    });

    return false;
  }

  function sendToJira( nick, msg, latLng ){

	var JIRA_JSON = '{"fields": {"project": {"key": "BAAS"},"summary": "Tampereen kunnossapitoilmoitus.","description":"'+ msg +'","issuetype": {"name": "Bug"}}}';

	console.log( JIRA_JSON );

	$.ajax({
  		type: "POST",
  		url: "http://baas.cloud.tilaa.com:8080/rest/api/2/issue",
  		data: JIRA_JSON,
		password: "admin", 
		username: "vaihda123__",
		contentType: "application/json; charset=utf-8",
  		//success: success,
  		dataType: "json",
		error: function(xhr, status, error) {
  			console.log(xhr.responseText);
			console.log(status);
			console.log(error);
		}
	});

	//$.post( "http://baas.cloud.tilaa.com:8080/rest/api/2/issue?authUsername=admin&authPassword=Vaihda123__&authMethod=Basic&httpClient.authenticationPreemptive=true", JIRA_JSON, "application/json" );
  }

});
