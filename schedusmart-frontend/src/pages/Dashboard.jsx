import Header from '../components/Header'
import React from 'react'
import { Navigate } from 'react-router-dom'

export default function Dashboard() {
    const [goToSettings, setGoToSettings] = React.useState(false)
    const [goToWelcome, setGoToWelcome] = React.useState(false)

    if (goToWelcome) {
        return(
            <>
            <Navigate to="/welcome" />
            </>
        );
    }

    if (goToSettings) {
        return(
            <>
            <Navigate to="/settings" />
            </>
        );
    }

    return(
        <>
        <Header/>
        <h2>Dashboard!</h2>
        <button onClick={() => {setGoToSettings(true)}}>Settings</button> 
        <button onClick={() => {setGoToWelcome(true)}}>Sign Out</button>
        </>
    );
}