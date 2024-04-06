// If you want to use email notification you can use this template 
// and you can go to EmailJS to add new template (password is stored in ScheduSmart Dev google account)
import React, { useState } from 'react'
import emailjs from '@emailjs/browser';

const EmailForm = (name, email, message) => {
  // Your EmailJS service ID, template ID, and Public Key
  const serviceId = 'service_wkmqw39';
  const templateId = 'template_5uqdebk';
  const publicKey = 'fjIa52LVlUWhGQqPw';

  // Create a new object that contains dynamic template params
  const templateParams = {
    from_name: 'ScheduSmart',
    recipient: email,
    to_name: name,
    message: message,
  };

  // Send the email using EmailJS
  emailjs.send(serviceId, templateId, templateParams, publicKey)
    .then((response) => {
      console.log('Email sent successfully!', response);
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
}

export default EmailForm