$(document).ready(function(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            
            $.getJSON('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=3b9d5ed397dc75ae87dadd2e65881d68', function(json){
                
                var code = json.weather[0].id;
                console.log(code);
                $.getJSON('/weatherIcons.json', function(iconsJson){
                    
                    var prefix = 'wi wi-';
                    var icon = iconsJson[code].icon;
                    var iconAlt = iconsJson[code].iconAlt;
                    var dateUTC = new Date();
                    console.log(dateUTC);
                    var timestamp = dateUTC.getTime() / 1000;
                    
                    //Current Time/Date
                    $.getJSON('https://maps.googleapis.com/maps/api/timezone/json?location=' + lat + ',' + lon + '&timestamp=' + timestamp + '&key=AIzaSyDn8-mFDgFAt9XUTmFHkLproXkEJUHusPI', function(googleJson){
                        //Get current time in current location
                        var dstOffset = googleJson.dstOffset;
                        console.log(dstOffset);
                        var rawOffset = googleJson.rawOffset;
                        console.log(rawOffset);
                        var currentTime = ((timestamp + dstOffset + rawOffset) * 1000); // Current date/time of user computer expressed as seconds since midnight, January 1, 1970 UTC
                        console.log(currentTime);
                        var currentDate = new Date(currentTime);
                        console.log(currentDate);
                        var dateString = currentDate.toISOString();
                        console.log(dateString);
                        dateString = dateString.slice(0, 10);
                        console.log(dateString);
                        
                        
                        $.getJSON('https://api.apixu.com/v1/forecast.json?key=0273729a39cc4f93bc5172633182104&q=' + lat + ',' + lon, function(sunriseSunset){
                            var sunRiseSetYear = currentDate.getFullYear();
                            var sunRiseSetMonth = currentDate.getMonth();
                            var sunRiseSetDay = currentDate.getDate();
                            console.log(sunriseSunset);
                            //Sunrise from APIXU
                            var sunrise = sunriseSunset.forecast.forecastday[0].astro.sunrise;
                            console.log(sunrise);
                            var sunriseHour = Number(sunrise.slice(0,2));
                            console.log(sunriseHour);
                            var sunriseMinute = Number(sunrise.slice(3,5));
                            console.log(sunriseMinute);
                            var sunriseTimestamp = new Date(Date.UTC(sunRiseSetYear, sunRiseSetMonth, sunRiseSetDay, sunriseHour, sunriseMinute));
                            sunriseTimestamp = sunriseTimestamp.getTime();
                            console.log(sunriseTimestamp);
                            
                            //Sunset from APIXU
                            var sunset = sunriseSunset.forecast.forecastday[0].astro.sunset;
                            console.log(sunset);
                            var sunsetHour = Number(sunset.slice(0,2)) + 12;
                            console.log(sunsetHour);
                            var sunsetMinute = Number(sunset.slice(3,5));
                            console.log(sunsetMinute);
                            var sunsetTimestamp = new Date(Date.UTC(sunRiseSetYear, sunRiseSetMonth, sunRiseSetDay, sunsetHour, sunsetMinute));
                            sunsetTimestamp = sunsetTimestamp.getTime();
                            console.log(sunsetTimestamp);
                            
                            if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
                                $('#condition').className = '';
                                if (code == 800){
                                    if (currentTime >= sunriseTimestamp && currentTime < sunsetTimestamp){
                                        icon = 'day-' + icon;
                                        icon = prefix + icon;
                                        console.log(icon);
                                        $('#condition').addClass(icon);
                                    }
                                    else {
                                        iconAlt = 'night-' + iconAlt;
                                        icon = prefix + iconAlt;
                                        console.log(icon);
                                        $('#condition').addClass(icon);
                                    }
                                }
                                else if (currentTime >= sunriseTimestamp && currentTime < sunsetTimestamp){
                                    icon = 'day-' + icon;
                                }
                                else {
                                    icon = 'night-alt-' + icon;
                                }

                                icon = prefix + icon;
                                console.log(icon);
                                $('#condition').addClass(icon);
                            }
                            
                            else {
                                icon = prefix + icon;
                                console.log(icon);
                                $('#condition').addClass(icon);
                            }
                        });
                        
                        /*
                        // If we are not in the ranges mentioned above, add a day/night prefix.
                        if (code == 800){
                            if (currentTime >= sunrise && currentTime < sunset){
                                icon = 'day-' + icon;
                                icon = prefix + icon;
                                console.log(icon);
                                $('#condition').removeClass().addClass(icon);
                            }
                            else {
                                iconAlt = 'night-' + iconAlt;
                                // Finally tack on the prefix.
                                icon = prefix + icon;
                                console.log(icon);
                                $('#condition').removeClass().addClass(iconAlt);
                            }
                        }
                        
                        if (!(code > 699 && code < 801) && !(code > 899 && code < 1000)) {
                            if (currentTime >= sunrise && currentTime < sunset){
                                icon = 'day-' + icon;
                            }
                            else {
                                icon = 'night-alt-' + icon;
                            }
    
                            // Finally tack on the prefix.
                            icon = prefix + icon;
                            console.log(icon);
                            $('#condition').removeClass().addClass(icon);
                        }
                        */
                    });
                });
                $('#city').html(json.name);
            });
            
            
            
            /*
            var weatherIcons = $.getJSON('weatherIcons.json', function(weatherJson){});
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var req = $.getJSON('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=3b9d5ed397dc75ae87dadd2e65881d68', function(json){
                console.log(lat);
                console.log(lon);
                console.log(req);
                $('#city').html(json.name);
            });
            
            req.then(function(resp) {
              var prefix = 'wi wi-';
              var code = resp.weather[0].id;
              console.log(code);
              var icon = weatherIcons[code].icon;
            
              // If we are not in the ranges mentioned above, add a day/night prefix.
              if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
                icon = 'day-' + icon;
              }
            
              // Finally tack on the prefix.
              icon = prefix + icon;
              console.log(icon);
              $('#condition').removeClass().addClass(icon);
            });
            
            */
            
        });
    }
});