import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const SignoutWindow = ({ onHide, show }) => (
  <Modal
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    {...{ onHide, show }}
  >
    <Modal.Header closeButton>
    </Modal.Header>
    <Modal.Body>
      <p>
        Are you sure you want to log out?
      </p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="outline-primary" onClick={() => console.log('送出')} > Yes</Button>
      <Button variant="outline-secondary" onClick={onHide}>No</Button>
    </Modal.Footer>
  </Modal>
);

export default SignoutWindow;