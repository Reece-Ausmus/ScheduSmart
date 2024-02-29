// This documentation is used for building create-account UI page

import { useState, useEffect } from 'react';
import './AccountInfo.css'

//this can be change when flask's ip become static
//currently it's localhost

const flaskURL = "http://127.0.0.1:5000";

export default function AccountInfo() {
    useEffect(() => {
        fetch("/user_data").then(response =>
            response.json().then(data => {
                console.log(data);
            }))
    }, [])

    const [firstname, setfirstName] = useState('');
    const [lastname, setlastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('West Lafayette')

    return (
        <div className="info_container">
            <div>
                <h1> Account Information </h1>
            </div>
            <div className="info">
                <p>
                First Name: {firstname}
                </p>
            </div>
            <div className="info">
                <p>
                Last Name: {lastname}   
                </p>
            </div>
            <div className="info">
                <p>
                Username: {username}
                </p>
            </div>
            <div className="info">
                <p>
                Email: {email}
                </p>
            </div>
            <div className="info">
                <p>
                Password: {password}
                </p>
            </div>
            <div className="info">
                <p>
                Location: {location}
                </p>
            </div>
        </div>
    );
}