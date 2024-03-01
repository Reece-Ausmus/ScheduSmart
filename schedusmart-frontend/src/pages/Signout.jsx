import Header from '../components/Header'
import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'


export default function Signout() {
  const [goToWelcome, setGoToWelcome] = React.useState(false)

  if (goToWelcome) {
      return(
          <>
          <Navigate to="/welcome" />
          </>
      );
  }

  const handleConfirmClick = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      //Yes
      sessionStorage.clear()
      setGoToWelcome(true)
    } else {
      //No
      // do nothing
    }
  };

  return (
    <>
    <Header/>
      <Button onClick={handleConfirmClick} >Sign out</Button>
    </>
  )
}