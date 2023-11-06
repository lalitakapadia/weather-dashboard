var apiKey = "f8308ddc94601e73d5a335126942b199";
var lat="";
var lon="";
var searchHistory = [];

function loadSearchHistory(){
    searchHistory = JSON.parse(localStorage.getItem("cityList"));
    console.log(JSON.stringify(searchHistory));
    if(searchHistory != null){
        for(let i=0; i < searchHistory.length; i++){
            var btnEl = $('<button>');
            btnEl.text(searchHistory[i]);
            $('#city-list').append(btnEl);
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
    var weatherRequestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon +"&units=metric&appid=" + apiKey;
    
    // step 2: get weather data for the given lat and lon of the city
    
    fetch(weatherRequestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
    console.log(data);
    
    });
}

$("#form-submit").click(function (event) {
    event.preventDefault();
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
});

function displayCityData(cityData){
    $('#current').attr('style','display: visible');
       $('#city').text(cityData.name);

    $('#date').text(dayjs.unix(cityData.dt).format('dddd, MMMM D, YYYY'));

    $('#temp').text('Temp: ' + Math.round(cityData.main.temp) + ' °C');

    $('#humidity').text('Humidity: ' + (cityData.main.humidity) + ' %');

    $('#wind').text('Wind: ' + (cityData.wind.speed) + ' MPH');
}

loadSearchHistory();