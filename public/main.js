$(document).ready(function(){
    //Hide celsius temp and symbol
    $('#celsius, #degreeC').hide();
    
    //Get current geolocation from browser
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            
            //Get current weather data from Openweathermap using lat and lon in JSON format
            $.getJSON('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=3b9d5ed397dc75ae87dadd2e65881d68', function(json){
                
                //Get code for current weather condition
                var code = json.weather[0].id;
                
                $.getJSON('/weatherIcons.json', function(iconsJson){
                    var prefix = 'wi wi-';
                    
                    //Lookup condition code in Icons JSON
                    var icon = iconsJson[code].icon;
                    var iconAlt = iconsJson[code].iconAlt;
                    
                    //Get current time in UTC as timestamp in seconds
                    var dateUTC = new Date();
                    var timestamp = dateUTC.getTime() / 1000;
                    
                    //Current Time/Date
                    $.getJSON('https://maps.googleapis.com/maps/api/timezone/json?location=' + lat + ',' + lon + '&timestamp=' + timestamp + '&key=AIzaSyDn8-mFDgFAt9XUTmFHkLproXkEJUHusPI', function(googleJson){
                        //Factor in daylight savings and time zone
                        var dstOffset = googleJson.dstOffset;
                        var rawOffset = googleJson.rawOffset;
                        var currentTime = ((timestamp + dstOffset + rawOffset) * 1000); // Current date/time of user computer expressed as seconds since midnight, January 1, 1970 UTC
                        var currentDate = new Date(currentTime);
                        
                        
                        
                        $.getJSON('https://api.apixu.com/v1/forecast.json?key=0273729a39cc4f93bc5172633182104&q=' + lat + ',' + lon, function(sunriseSunset){
                            //Get year, month, and day of sunrise/sunset
                            var sunRiseSetYear = currentDate.getFullYear();
                            var sunRiseSetMonth = currentDate.getMonth();
                            var sunRiseSetDay = currentDate.getDate();
                            
                            //Get sunrise time from APIXU
                            var sunrise = sunriseSunset.forecast.forecastday[0].astro.sunrise;
                            
                            //Slice hour and minute from time
                            var sunriseHour = Number(sunrise.slice(0,2));
                            var sunriseMinute = Number(sunrise.slice(3,5));
                            
                            //Create new timestamp for sunrise
                            var sunriseTimestamp = new Date(Date.UTC(sunRiseSetYear, sunRiseSetMonth, sunRiseSetDay, sunriseHour, sunriseMinute));
                            sunriseTimestamp = sunriseTimestamp.getTime();
                            
                            //Get sunset time from APIXU
                            var sunset = sunriseSunset.forecast.forecastday[0].astro.sunset;
                            
                            //Slice hour and minute from time
                            var sunsetHour = Number(sunset.slice(0,2)) + 12;
                            var sunsetMinute = Number(sunset.slice(3,5));
                            
                            //Create new timestamp for sunset
                            var sunsetTimestamp = new Date(Date.UTC(sunRiseSetYear, sunRiseSetMonth, sunRiseSetDay, sunsetHour, sunsetMinute));
                            sunsetTimestamp = sunsetTimestamp.getTime();
                            
                            //Choose day/night icon by comparing local time with time of sunrise/sunset
                            if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
                                
                                $('#condition').className = '';
                                var dayNight = '';
                                
                                //Change sun to moon icon for nightime clear conditions only
                                if (code == 800){
                                    if (currentTime >= sunriseTimestamp && currentTime < sunsetTimestamp){
                                        icon = 'day-' + icon;
                                        icon = prefix + icon;
                                        $('#condition').addClass(icon);
                                        dayNight = 'day';
                                    }
                                    else {
                                        iconAlt = 'night-' + iconAlt;
                                        icon = prefix + iconAlt;
                                        $('#condition').addClass(icon);
                                        dayNight = 'night';
                                    }
                                }
                                else if (currentTime >= sunriseTimestamp && currentTime < sunsetTimestamp){
                                    icon = 'day-' + icon;
                                    dayNight = 'day';
                                }
                                else {
                                    icon = 'night-alt-' + icon;
                                    dayNight = 'night';
                                }

                                icon = prefix + icon;
                                
                                $('#condition').addClass(icon);
                                
                                //Change background color for night and day
                                if (dayNight == 'day'){
                                    $('body').css('background', 'linear-gradient(#97ccf1, #ffa500)');
                                }
                                else {
                                    $('body').css('background', 'linear-gradient(#97ccf1, #330033)');
                                }
                            }
                            
                            else {
                                icon = prefix + icon;
                                $('#condition').addClass(icon);
                            }
                            
                            //Load Current city/state
                            $('#city').html(sunriseSunset.location.name + ', ' + sunriseSunset.location.region);
                            
                            //Load current temp in F and C, hide C on page load
                            var degreeF = Math.round(sunriseSunset.current.feelslike_f);
                            $('#farenheit').html(degreeF);
                            $('#degreeF').html('&degF');
                            var degreeC = Math.round(sunriseSunset.current.feelslike_c);
                            $('#celsius').html(degreeC);
                            $('#degreeC').html('&degC');
                            $('#degreeC, #degreeF').click(function(){
                            $('#degreeC, #degreeF, #celsius, #farenheit').toggle();
                            });
                        });
                    });
                });
            });
        });
    }
});