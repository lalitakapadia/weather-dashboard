var apiKey = "f8308ddc94601e73d5a335126942b199";
var lat="";
var lon="";
// step 1 : fetch lat and lon for given city

function getCityName(cityName){
    
    var currentWeatherRequestURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&limit=5&appid=' + apiKey;
    
    fetch(currentWeatherRequestURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        
        lat = data.coord.lat;
        lon = data.coord.lon;

        getWeather(lat, lon);

        console.log(data);
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
    alert('form submit');
    event.preventDefault();
    var cityName = $("input").val().trim();
    getCityName(cityName);
})


