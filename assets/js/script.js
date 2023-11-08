//generated API key for the given assignment
var apiKey = "f8308ddc94601e73d5a335126942b199";
//latitude and longitude are retrieved in first API and needed for second API call
var lat="";
var lon="";
//collection of search history and stored in local storage
var searchHistory = [];

function loadSearchHistory(){
    searchHistory = JSON.parse(localStorage.getItem("cityList"));
    console.log(JSON.stringify(searchHistory));
    if(searchHistory != null){
        $("#city-list").empty();
        for(let i=0; i < searchHistory.length; i++){
            var btnEl = $('<button>');
            btnEl.text(searchHistory[i]);
            btnEl.addClass('btn btn-secondary');
            btnEl.attr('style', 'margin:2px;');
            $('#city-list').prepend(btnEl);
            btnEl.on('click', handleSearchEvent);
        }
    }
}

function handleSearchEvent(event){
    var btnClicked = $(event.target);
    getCityName(btnClicked.text());
    $('#city-input').val(btnClicked.text());
}
  // step 1 : fetch lat and lon for given city
  //function that gets the rest of the current weather and the daily weather

function getCityName(cityName){

    //function that uses the city user input to make an API call
    var currentWeatherRequestURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=metric&limit=5&appid=' + apiKey;
    
    fetch(currentWeatherRequestURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (cityData) {
        
   //stores the coordinates for lat and lon from the API response
        lat = cityData.coord.lat;
        lon = cityData.coord.lon;

        // display city data
        displayCityData(cityData);

        getWeather(lat, lon);

        console.log(cityData);

        if(searchHistory == null){
            searchHistory = [cityName];
            localStorage.setItem("cityList", JSON.stringify(searchHistory));
        } 

        if(searchHistory.indexOf(cityName) == -1){
            // only add into search history if the city not already exist in the array
            searchHistory.push(cityName);
            localStorage.setItem("cityList", JSON.stringify(searchHistory));
        }
        loadSearchHistory();
          
    });
}
  //function that uses the city user input to make an API call
function getWeather(cityLat, cityLon){
    //alert('inside of waether function:' + cityLat +"," + cityLon);
    var weatherRequestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon +"&exclude=minutely,hourly&units=metric&appid=" + apiKey;
    
    // step 2: get weather data for the given lat and lon of the city
    
    fetch(weatherRequestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        
    displayDailyWeather(data);
    
    });
}
function searchButton() {
    var cityName = $("input").val().trim();
    getCityName(cityName);
}
  //submit event for when the users enter the city search term
  $("#city-form").submit(function (event) {
    event.preventDefault();
    searchButton();
})

$("#form-submit").click(function (event) {
    event.preventDefault();
   searchButton();
});
 //getting html IDs with the current weather data
function displayCityData(cityData){
      //displays the html to the user
    $('#current').attr('style','display: visible');
       $('#city').text(cityData.name);

    $('#date').text(dayjs.unix(cityData.dt).format('(DD/MM/YYYY)')); 
    
    $('#cityWeatherIcon').attr('src',"https://openweathermap.org/img/wn/" + cityData.weather[0].icon + '@2x.png');

    $('#temp').text('Temp: ' + Math.round(cityData.main.temp) + ' °C');

    $('#humidity').text('Humidity: ' + (cityData.main.humidity) + ' %');

    $('#wind').text('Wind: ' + (cityData.wind.speed) + ' MPH');


    //gets the weather icon and appends it the page
    var icon = cityData.weather[0].icon;
    var iconImg = $("<img>");
    iconImg.addClass("img-fluid");
    iconImg.attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png")
    $("#city").append(iconImg);
}

function displayDailyWeather(weatherData) {
    //displays this html to the user
    console.log(weatherData);
    $('#five-day').attr('style', 'diaplay: visible');
    //ensures the 5-day forecast is removed before displaying the next city's data
    $('.card-deck').empty();
    for(i = 1; i < weatherData.list.length; i+=8){

    //creates dynamic elements
      var weatherCard = $("<div class='card text-white bg-primary p-2'>");
      var tempP = $('<p>');
      var humP = $('<p>');
      var imgIcon = $('<img>');
      var dateH6 = $('<h6>');
      var windP = $('<p>');

    //adds text and attributes to the dynamic elements
      tempP.text('Temp:' + Math.round(weatherData.list[i].main.temp) + '°C');
      humP.text('Humidity:' + (weatherData.list[i].main.humidity) + '%');
      imgIcon.attr('src',"https://openweathermap.org/img/wn/" + weatherData.list[i].weather[0].icon + '@2x.png');
      dateH6.text(dayjs.unix(weatherData.list[i].dt).format('DD/MM/YYYY'));
      windP.text('Wind: ' + (weatherData.list[i].wind.speed) + ' MPH');

     //appends the dynamic elements to the html
      weatherCard.append(dateH6);
      weatherCard.append(imgIcon);
      weatherCard.append(tempP);
      weatherCard.append(humP);
      weatherCard.append(windP);
         
      $(".card-deck").append(weatherCard);
    }
}
 
loadSearchHistory();
