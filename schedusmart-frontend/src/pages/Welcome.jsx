import React from 'react'
import Header from '../components/Header'
import { Navigate } from 'react-router-dom';

export default function Welcome() {
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
        <div>
            <button> Sign-in </button>
            <button> Create an account </button> 
            <button onClick={() => {setGoToDash(true)}}> Go To Dashboard | for development purposes</button>
        </div>
        </>
    );
}