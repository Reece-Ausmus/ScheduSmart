import React from 'react'

export default function Weather() {
    const [location, setLocation] = React.useState("West Lafayette")
    const [weather, setWeather] = React.useState({})

    const api = {
        key: "32d36a265443fe0bc95c8de0461515f7",
        base: "https://api.openweathermap.org/data/2.5/",
    };

    const searchPressed = () => {
        fetch(`${api.base}weather?q=${location}&units=imperial&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
            setWeather(result);    
        });
    };

    return(
        <>
        {searchPressed()}
        {typeof weather.main != "undefined" ?
            <>The temperature in {weather.name} is {weather.main.temp} ℉.</>
        : 
            "Please set location in settings to recieve weather information"
        }
        </>
    );
}