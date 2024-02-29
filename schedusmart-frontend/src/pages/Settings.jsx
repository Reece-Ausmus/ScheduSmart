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
        <div>
        <h2>Settings</h2>
        <button onClick={() => {setGoToCalendar(true)}}>Calendar</button>
        </div>
        </>
    );
}