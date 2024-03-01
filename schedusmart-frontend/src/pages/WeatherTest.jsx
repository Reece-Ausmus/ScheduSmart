import React from "react";

export default function WeatherTest() {
  const [search, setSearch] = React.useState("");
  const [weather, setWeather] = React.useState({});

  const api = {
    key: "32d36a265443fe0bc95c8de0461515f7",
    base: "https://api.openweathermap.org/data/2.5/",
  };

  const searchPressed = () => {
    fetch(`${api.base}weather?q=${search}&units=imperial&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        setWeather(result);
      });
  };

  return (
    <>
      <div>
        <header>
          {/* HEADER*/}
          <h1>Weather App Tester</h1>

          {/* Search Box */}
          <div>
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={searchPressed}>Search</button>
          </div>

          {typeof weather.main != "undefined" ? (
            <div>
              {/* Location */}
              <p type="text">{weather.name}</p>
              {/* Temprature */}
              <p type="text">{weather.main.temp} ℉</p>
              {/* Condition */}
              <p type="text">{weather.weather[0].main}</p>
              <p type="text">{weather.weather[0].description}</p>
            </div>
          ) : (
            "Enter Accurate City Name"
          )}
        </header>
      </div>
    </>
  );
}
