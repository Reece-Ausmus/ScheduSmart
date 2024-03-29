import React, { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

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
          try {
            fetch(`${api.base}weather?q=${responseData.location}&units=imperial&APPID=${api.key}`)
              .then((res) => res.json())
              .then((result) => {
                setWeather(result);
              });
          } catch {
            console.log("Error! Set location data in settings!")
          }
          break;
        case 202:
          alert("User Not Found");
          break;
        case 205:
          alert("Failing to retrieve user data");
          break;
      }
    }
  };

  const [weather, setWeather] = React.useState({});

  const api = {
    key: "b75007c5316302911c5797f40c9c7dc4",
    base: "https://api.openweathermap.org/data/2.5/",
  };

  useEffect(() => {
    handleInfo();
  }, []);

  return (
    <>
      {/* <Card variant="outlined" style={{ height: '60px' }}>
        <CardContent> */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          {typeof weather.main !== "undefined" ? (
            <Typography variant="body1">
              The temperature in {weather.name} is {weather.main.temp} ℉.
            </Typography>
          ) : (
            <Typography variant="body1">
              Please set location in settings to receive weather information
            </Typography>
          )}
          </div>
        {/* </CardContent>
      </Card> */}
    </>
  );
}
