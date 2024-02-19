import React from 'react'
import Header from '../components/Header'
import { Navigate } from 'react-router-dom';

export default function Welcome() {
    const handleButtonClick = () => {
        window.location.href = '/createaccount';
      };

    const [goToDash, setGoToDash] = React.useState(false)

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
        <h2>Welcome!</h2>
        <button>Sign-in! This does nothing until sign-in is implemented</button>
        <button onClick={handleButtonClick}>Create an account!</button>
        <button onClick={() => {setGoToDash(true)}}>Dashboard | For testing purposes</button>
        <button onClick={() => { window.location.href = '/signout'}}>Sign out</button>
        </>
    );
}