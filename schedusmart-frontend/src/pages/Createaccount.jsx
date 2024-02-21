// This documentation is used for building create-account UI page

import { useState } from 'react';
import './Createaccount.css'

//this can be change when flask's ip become static
//currently it's localhost

const flaskURL = "http://127.0.0.1:5000";

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
            <div class="button" onClick={async () => {
                if (password.localeCompare(confirm_password)) {
                    alert("confirm password does not match");
                }
                else if (!name.localeCompare('')) {
                    alert("please fill up your name");
                }
                else if (!username.localeCompare('')) {
                    alert("please fill up your username");
                }
                else if (!email.localeCompare('')) {
                    alert("please fill up your email");
                }
                else if (!password.localeCompare('')) {
                    alert("please fill up your password");
                }
                else if (password.length < 6) {
                    alert("Password must be at least 6 characters long.")
                }
                else {
                    console.log("success");
                    const new_account = {name, username, email, password};
                    const response = await fetch(flaskURL + '/create_account', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(new_account)
                    })
                    if (!response.ok) {
                        alert("something went wrong, refresh your website");
                    } else{
                        switch(response.status) {
                            case 201:
                                console.log("create account successfully");
                                window.location.href = '/'
                                break;
                            case 205:
                                alert("invalid email.");
                                break;
                        }
                    }
                } 
            }
            }>
                <button type="submit">Create Account</button>
                <button onClick={() => { window.location.href = '/'}}>Go Back</button>
            </div>
        </div>
    );
}