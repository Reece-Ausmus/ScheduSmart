import React from 'react'
import Header from '../components/Header'
import { Navigate } from 'react-router-dom';

export default function Welcome() {
    /*const [goToDash, setGoToDash] = React.useState(false)

    if (goToDash) {
        return(
            <>
            <Navigate to="/dashboard" />
            </>
        );
    }*/

    return(
        <>
        <Header/>
        <h2>Welcome!</h2>
        <button onClick={() => { window.location.href = '/signin'}}>Sign-in!</button>
        <button onClick={() => { window.location.href = '/createaccount'}}>Create an account!</button>
        {/*<button onClick={() => {setGoToDash(true)}}>Dashboard | For testing purposes</button>*/}
        <button onClick={() => { window.location.href = '/settings'}}>Settings</button>
        <button onClick={() => { window.location.href = '/signout'}}>Sign out</button>
        <button onClick={() => { window.location.href = '/taskmanager'}}>Task Manager</button>
        </>
    );
}