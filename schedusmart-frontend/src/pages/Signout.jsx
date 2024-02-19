import Header from '../components/Header'
import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'


function SignoutWindow(props) {
  const [goToWelcome, setGoToWelcome] = React.useState(false)

  if (goToWelcome) {
      return(
          <>
          <Navigate to="/welcome" />
          </>
      );
  }

  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered='true'
      fullscreen='sm-down'
    >
      <Modal.Body>
        <p>
          Do you sure that you want to sign out?   
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={() => {setGoToWelcome(true)}} > Yes</Button>
        <Button onClick={props.onHide}>No</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function Logout() {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <>
    <Header/>
      <Button onClick={() => setIsClicked(true)} >Sign out</Button>
      {isClicked &&
        <SignoutWindow
          show={isClicked}
          onHide={() => setIsClicked(false)}
        />}
    </>
  )
}