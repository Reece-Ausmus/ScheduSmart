// This documentation is used for building create-account UI page

import { useState } from 'react';
import './Createaccount.css'

export default function Createaccount() {
    const [firstname, setfirstName] = useState('');
    const [lastname, setlastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, confirmpassword] = useState('');
    return (
        <div>
            <div className="headers" >
                <p> Create Account Form </p>
            </div>
            <div className="sub-headers">
                <p> Complete your profile by filling in this account creation form </p>
                <hr className="line" />
            </div>
            <div className="group name">
                <label htmlFor="firstname">Name:</label>
                <input type="text" id="firstname" value={firstname} onChange={(e) => setfirstName(e.target.value)} placeholder="First name" />
                <label htmlFor="lastname"></label>
                <input type="text" id="lastname" value={lastname} onChange={(e) => setlastName(e.target.value)} placeholder="Last name" />
            </div>
            <div className="group username">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="group email">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="group password">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="group confirm-password">
                <label htmlFor="confirm-password">Confirm Password:</label>
                <input type="password" id="confirm-password" value={confirm_password} onChange={(e) => confirmpassword(e.target.value)} />
            </div>
            <div class="button">
                <button type="submit">Create Account</button>
                <button onClick={() => { window.location.href = '/'}}>Go Back</button>
            </div>
        </div>
    );
}