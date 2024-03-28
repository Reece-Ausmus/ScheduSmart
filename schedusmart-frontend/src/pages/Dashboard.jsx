import Header from '../components/Header'
import React from 'react'
import { Navigate } from 'react-router-dom'
import './MainFrame.css'

export default function Dashboard() {
    // handle redirects
    const [goToSettings, setGoToSettings] = React.useState(false)
    const [goToSignOut, setGoToSignOut] = React.useState(false);
    const [goToTaskManager, setGoToTaskManager] = React.useState(false)
    const [goToNotes, setGoToNotes] = React.useState(false)
    const [goToHabits, setGoToHabits] = React.useState(false)

    if (goToSettings) {
      return(
          <>
          <Navigate to="/settings" />
          </>
      );
    }

    if (goToSignOut) {
    return (
      <>
        <Navigate to="/signout" />
      </>
    );
    }

    if (goToNotes) {
      return (
        <>
          <Navigate to="/notes" />
        </>
      );
    }

    if (goToHabits) {
      return (
        <>
          <Navigate to="/Habits" />
        </>
      );
    }


    return (
      <>
      <div className="upperBar">
        <h1 className="title"> 
        Welcome to ScheduSmart!
        </h1>
        <button className="upperBarButton" onClick={() => {setGoToSettings(true)}}>
          Settings
        </button>
        <button className="upperBarButton" onClick={() => {setGoToHabits(true)}}>
          Habits
        </button>
        <button className="upperBarButton" onClick={() => {setGoToNotes(true)}}>
          Notes
        </button>
        <button className="upperBarButton" onClick={() => {setGoToSignOut(true)}}>
          Signout
        </button>
      </div>
      </>
    );
}