import Header from '../components/Header'
import React from 'react'
import { Navigate } from 'react-router-dom'
import Calendar from './Calendar'

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
        <h1>Dashboard</h1>
        <div>
        <button onClick={() => {setGoToSettings(true)}}>Settings</button> 
        <button onClick={() => {setGoToWelcome(true)}}>Welcome</button>
        </div>
        <Calendar/>
        </>
    );
}