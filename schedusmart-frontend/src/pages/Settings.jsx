import Header from '../components/Header'
import React from 'react'
import { Navigate } from 'react-router-dom'

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
        <Header/>
        <h2>Settings!</h2>
        <h3>Weather App Testing</h3>
        <button onClick={() => {setGoToDash(true)}}>Dashboard</button>
        <button onClick={() => {setGoToWelcome(true)}}>Sign Out</button>
        </>
    );
}