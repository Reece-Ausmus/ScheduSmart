import React, {useState, useEffect} from "react";

const flaskURL = "http://127.0.0.1:5000";
const userId = sessionStorage.getItem("user_id");

export default function Weather() {
  const handleInfo = async (event) => {
    const response = await fetch(flaskURL + "/user_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        'user_id': userId,
      }),
      credentials: "include",
    });
    if (!response.ok) {
      alert("Account Info Not Found. Please log-out and log-in again");
    } else {
      switch (response.status) {
        case 201:
          const responseData = await response.json();
          const userId = responseData.user_id;
          if (responseData.location != null) setLocation(responseData.location);
          console.log(userId);
          break;
        case 202:
          alert("User Not Found");
          break;
        case 205:
          alert("Failing to retrieve user data");
          break;
      }
    }

    try {
      fetch(`${api.base}weather?q=${location}&units=imperial&APPID=${api.key}`)
          .then((res) => res.json())
          .then((result) => {
            setWeather(result);
      }).then(console.log("Set Weather!"));
    } catch {
      console.log("Error!")
    }
  };

  const [location, setLocation] = React.useState("West Lafayette");
  const [weather, setWeather] = React.useState({});

  const api = {
    key: "b75007c5316302911c5797f40c9c7dc4",
    base: "https://api.openweathermap.org/data/2.5/",
  };

  useEffect(() => {
    handleInfo();
  }, []);

  const searchPressed = () => {
    try {
      fetch(`${api.base}weather?q=${location}&units=imperial&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          setWeather(result);
        });
    } catch {
      console.log("Error! Refresh Page")
    }
  };

  return (
    <>
      {typeof weather.main != "undefined" ? (
        <>
          The temperature in {weather.name} is {weather.main.temp} ℉.
        </>
      ) : (
        "Please set location in settings to recieve weather information"
      )}
    </>
  );
}
