import { useState } from 'react';
import './Createaccount.css'

export default function Createaccount() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    return (
        <div>
            <div className="headers" >
                <p> Create Account Form </p>
            </div>
            <div className="sub-headers">
                <p> Complete your profile by filling in this account creation form </p>
            </div>
            <div className="group-form name-form">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="group-form username-form">
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="group-form email-form">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
        </div>
    );
}