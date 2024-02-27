import Header from '../components/Header'
import React from 'react'
import { Navigate } from 'react-router-dom'

export default function Settings() {
    const [goToDash, setGoToDash] = React.useState(false)
    const [goToWelcome, setGoToWelcome] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const [weather, setWeather] = React.useState({})

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

    if (goToWelcome) {
        return(
            <>
            <Navigate to="/welcome" />
            </>
        );
    }

    if (goToDash) {
        return(
            <>
            <Navigate to="/dashboard" />
            </>
        );
    }

    return(
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

                {typeof weather.main != "undefined" ?
                    <div>
                        {/* Location */}
                        <p>{weather.name}</p>
                        {/* Temprature */}
                        <p>{weather.main.temp} ℉</p>
                        {/* Condition */}
                        <p>{weather.weather[0].main}</p>
                        <p>{weather.weather[0].description}</p>
                    </div>
                : 
                    "Enter City Name"
                }
            </header>
        </div>

        <Header/>
        <h2>Settings!</h2>
        <button onClick={() => {setGoToDash(true)}}>Dashboard</button>
        <button onClick={() => {setGoToWelcome(true)}}>Sign Out</button>
        </>
    );
}