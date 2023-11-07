var apiKey = "f8308ddc94601e73d5a335126942b199";
var lat="";
var lon="";
var searchHistory = [];

function loadSearchHistory(){
    searchHistory = JSON.parse(localStorage.getItem("cityList"));
    console.log(JSON.stringify(searchHistory));
    if(searchHistory != null){
        $("#city-list").empty();
        for(let i=0; i < searchHistory.length; i++){
            var btnEl = $('<button>');
            btnEl.text(searchHistory[i]);
            $('#city-list').prepend(btnEl);
            btnEl.on('click', handleSearchEvent);
        }
    }
}

function handleSearchEvent(event){
    var btnClicked = $(event.target);
    getCityName(btnClicked.text());
}
// step 1 : fetch lat and lon for given city

function getCityName(cityName){
    
    var currentWeatherRequestURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=metric&limit=5&appid=' + apiKey;
    
    fetch(currentWeatherRequestURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (cityData) {
        
        lat = cityData.coord.lat;
        lon = cityData.coord.lon;

        // display city data
        displayCityData(cityData);

        getWeather(lat, lon);

        console.log(cityData);

       
       
       
    });
}

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

function displayCityData(cityData){
    $('#current').attr('style','display: visible');
       $('#city').text(cityData.name);

    $('#date').text(dayjs.unix(cityData.dt).format('dddd, MMMM D, YYYY'));

    $('#temp').text('Temp: ' + Math.round(cityData.main.temp) + ' °C');

    $('#humidity').text('Humidity: ' + (cityData.main.humidity) + ' %');

    $('#wind').text('Wind: ' + (cityData.wind.speed) + ' MPH');
}

function displayDailyWeather(weatherData) {
    $('#five-day').attr('style', 'diaplay: visible');
    $('.card-deck').empty();
    for(i = 0; i < weatherData.list.length; i++){
      var weatherCard = $("<div class='card text-white bg-primary p-2'>");
      var tempP = $('<p>');
      var humP = $('<p>');
      var imgIcon = $('<img>');
      var dateH6 = $('<h6>');

      tempP.text('Temp:' + (weatherData.list[i].main.temp) + '°C');
      humP.text('Humidity:' + (weatherData.list[i].main.humidity) + '%');
      imgIcon.attr('src',"https://openweathermap.org/img/wn/" + weatherData.list[i].weather[0].icon + '@2x.png');
      dateH6.text(dayjs.unix(weatherData.list[i].dt).format('DD/MM/YYYY'));

      weatherCard.append(dateH6);
      weatherCard.append(tempP);
      weatherCard.append(humP);
      weatherCard.append(imgIcon);
      $(".card-deck").append(weatherCard);
    }
}
 
loadSearchHistory();
