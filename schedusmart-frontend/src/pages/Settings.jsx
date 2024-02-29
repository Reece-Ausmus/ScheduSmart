import Header from '../components/Header'
import React from 'react'
import { Navigate } from 'react-router-dom'
import AccountInfo from "./AccountInfo.jsx"

export default function Settings() {
    const [goToCalendar, setGoToCalendar] = React.useState(false)

    if (goToCalendar) {
        return(
            <>
            <Navigate to="/calendar"/>
            </>
        );
    }

    return(
        <>
        <h1>Settings</h1>
        <AccountInfo/>
        <button onClick={() => {setGoToCalendar(true)}}>Calendar</button>
        </>
    );
}