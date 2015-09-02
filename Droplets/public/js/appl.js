


//Angular App Module and Controller


angular.module('mapsApp', [])
.controller('MapCtrl', function ($scope,$http) 
{
   $scope.address='NA';
   $scope.radiusvalue=50;
   $scope.date = new Date();
   var geocoder = new google.maps.Geocoder();
   var mapOptions = 
   {
        zoom: 6,
		options: {
            suppressInfoWindows:true
        },
        center: new google.maps.LatLng(12.971598700000000000, 77.594562699999980000),
        mapTypeId: google.maps.MapTypeId.ROADMAP
   }
   $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
   var input = (document.getElementById('pac-input'));
   $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
   var searchBox = new google.maps.places.SearchBox((input));
   google.maps.event.addListener(searchBox, 'places_changed', function() 
   {
		var places = searchBox.getPlaces();
		if (places.length == 0) 
		{
		  return;
		}
		// For each place, get the icon, place name, and location.
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0, place; place = places[i]; i++)
		{
		  var image =
		  {
			url: place.icon,
			size: new google.maps.Size(31,31),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(10,20),
			scaledSize: new google.maps.Size(15,15)
		  };
		  bounds.extend(place.geometry.location);
		}
		$scope.map.fitBounds(bounds);
		//$scope.map.setZoom(16);
   });
   var lat=0.0;var lng=0.0;
   var circle;
   $scope.testvar='';
   google.maps.event.addListener($scope.map, 'click', function (e) 
   {
					$scope.map.setCenter(e.latLng);
					document.getElementById('popup').style.display='block';
					//var center1 = new google.maps.LatLng(e.latLng.lat() , e.latLng.lng());
					lat=e.latLng.lat();
					lng=e.latLng.lng();
					$scope.address=$scope.getAddress(new google.maps.LatLng(lat,lng));
					console.log('address : '+$scope.address);
					$scope.alert = {
					 Lat: lat,
					 Lng: lng,
					 Radius:50,
					 Address:"",
					 GeofenceIdentity:"dummydata",
					 Location:"location"
					};
					circle = new google.maps.Circle(
					{
						center:  new google.maps.LatLng(lat,lng),
						map: $scope.map,
						radius: 50,          // IN METERS.
						fillColor: '#FF6600',
						fillOpacity: 0.4,
						strokeColor: "#FFF",
						strokeWeight: 1         // DON'T SHOW CIRCLE BORDER.
					});
	});
	var refresh= function()
	{
		//var cities=[];
		$scope.markers = [];
		$http.get('/alerts').success(function(response)
		{
			
				//var cities=response.value;
				var cities=response;
				//console.log('cities : '+JSON.stringify(cities));
				$scope.markers = [];
				var infoWindow = new google.maps.InfoWindow();
				var createMarker = function (info){
					circle = new google.maps.Circle(
					{
						center:  new google.maps.LatLng(info.Lat,info.Lng),
						map: $scope.map,
						radius: info.Radius,          // IN METERS.
						fillColor: '#FF6600',
						fillOpacity: 0.4,
						strokeColor: "#FFF",
						strokeWeight: 1         // DON'T SHOW CIRCLE BORDER.
					});
					var marker = new google.maps.Marker({
						map: $scope.map,
						position: new google.maps.LatLng(info.Lat, info.Lng),
						title: info.Description,
						address:info.Address,
						animation: google.maps.Animation.DROP,
						id:info.ID
					});
					marker.content = '<div class="infoWindowContent">' + info.msg + '</div>';
					
					google.maps.event.addListener(marker, 'click', function(){
						//alert(1233);
						 $scope.toggleBounce(marker);
						 $scope.map.setZoom(16);
						 $scope. map.setCenter(marker.getPosition());
						//infoWindow.setContent('<h2>' + marker.title + '</h2><br>' );
						//infoWindow.open($scope.map, marker);
					});
					
					$scope.markers.push(marker);
				}  
				
				for (i = 0; i < cities.length; i++){
					
					createMarker(cities[i]);
					console.log(cities[i]);
				}

				$scope.openInfoWindow = function(e, selectedMarker){
					e.preventDefault();
					google.maps.event.trigger(selectedMarker, 'click');
				}
				
		});
	};
	refresh();
	$scope.toggleBounce= function(marker)
	{
			  if (marker.getAnimation() != null) {
				marker.setAnimation(null);
			  } else {
				marker.setAnimation(google.maps.Animation.DROP); //BOUNCE OR DROP
			  }
	};
	$scope.remove = function(id)
	{
		document.getElementById('popup').style.display='none';
		$http.delete('/alerts/' + id).success(function(response)
		{
			refresh();
		});
		
	}
		
	$scope.getdata = function(id)
	{
		$http.get('/alerts/'+id).success(function(response)
		{
			console.log(response);
			document.getElementById('popup').style.display='block';
			$scope.alert=response;
			circle = new google.maps.Circle(
								{
									center:  new google.maps.LatLng($scope.alert.lat,$scope.alert.lng),
									map: $scope.map,
									radius: $scope.alert.radius,          // IN METERS.
									fillColor: '#FF6600',
									fillOpacity: 0.4,
									strokeColor: "#FFF",
									strokeWeight: 1         // DON'T SHOW CIRCLE BORDER.
								});
			
		});
	}
	
	$scope.closepopup = function()
	{
	   document.getElementById('popup').style.display='none';
	    circle.setMap(null);
	};
	$scope.updateradius = function()
	{
		var radiusnum=parseInt($scope.range);
		$scope.radiusvalue=radiusnum;
		circle.setRadius(radiusnum);
		
		
		 $scope.alert = {
		 Lat: lat,
         Lng: lng,
		 Radius:radiusnum,
		 Address:$scope.address,
		 GeofenceIdentity:"dummydata",
		 Location:"location"
      };
		
		
	}; 
	
	$scope.savedata = function()
	{
		$http.post('/alerts/',$scope.alert).success(function(response)
		{
			document.getElementById('popup').style.display='none';
			refresh();
		});
	
	};
	$scope.getAddress= function(latLng)
	{
			geocoder.geocode( {'latLng': latLng},function(results, status) 
			{
				if(status == google.maps.GeocoderStatus.OK)
				{
					
					  if(results[0]) 
					  {
					   $scope.address=results[0].formatted_address;
					   
					  }
					  else
					  {
						$scope.address = "No results";
					  }
					 // console.log($scope.address1);
					  return $scope.address;
				}
				else 
				{
				  $scope.address =status;
				  return $scope.address;
				}
			});
			
			//console.log(address);
			
	};
   

});
