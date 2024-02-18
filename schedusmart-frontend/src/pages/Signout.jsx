import Header from '../components/Header'
import React from 'react'
import { Navigate } from 'react-router-dom'

export default function Settings() {
    return(
        <>
        <Header/>
        <button>Sign out</button>
        </>
    );
}