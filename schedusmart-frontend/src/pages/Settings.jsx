import Header from '../components/Header'
import React from 'react'
import { Navigate } from 'react-router-dom'
import WeatherTest from './WeatherTest'
import Weather from './Weather'

export default function Settings() {
    const [goToDash, setGoToDash] = React.useState(false)
    const [goToWelcome, setGoToWelcome] = React.useState(false)

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
        <Header/>
        <h2>Settings!</h2>
        <button onClick={() => {setGoToDash(true)}}>Dashboard</button>
        <button onClick={() => {setGoToWelcome(true)}}>Sign Out</button>
        </div>
        <Weather/> 
        </>
    );
}