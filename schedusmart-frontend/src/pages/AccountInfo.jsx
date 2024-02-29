// This documentation is used for building create-account UI page

import { useState } from 'react';

//this can be change when flask's ip become static
//currently it's localhost

const flaskURL = "http://127.0.0.1:5000";

export default function AccountInfo() {
    const [firstname, setfirstName] = useState('');
    const [lastname, setlastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, confirmpassword] = useState('');

    return (
        <div>
            <div>
                <p> Account Information </p>
            </div>
            <div>
                <p>View and Change Account Information</p>
                <hr/>
            </div>
            <div>
                <label htmlFor="firstname">Name:</label>
                <input type="text" id="firstname" value={firstname} onChange={(e) => setfirstName(e.target.value)} placeholder="First name" />
                <label htmlFor="lastname"></label>
                <input type="text" id="lastname" value={lastname} onChange={(e) => setlastName(e.target.value)} placeholder="Last name" />
            </div>
            <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div>
                <label htmlFor="confirm-password">Confirm Password:</label>
                <input type="password" id="confirm-password" value={confirm_password} onChange={(e) => confirmpassword(e.target.value)} />
            </div>
            <div>
                <button  onClick={async () => {
                const letterRegex = /[a-zA-Z]/;
                const numberRegex = /[0-9]/;
                const regex = /[\\"\s\'\\\x00-\x1F\x7F]/g; 

                if (!lastname.localeCompare('') && !firstname.localeCompare('')) {
                    alert("Please fill up your name!");
                }
                else if (!username.localeCompare('')) {
                    alert("Please fill up your username!");
                }
                else if (!email.localeCompare('')) {
                    alert("Please fill up your email!");
                }
                else if (!password.localeCompare('')) {
                    alert("Please fill up your password!");
                }
                else if (regex.test(firstname) || regex.test(lastname) || regex.test(username) || regex.test(password) || regex.test(confirm_password)) {
                    alert("Input contains special characters. Please remove them and try again!"); 
                } // avoid special characters in input
                else if (password.localeCompare(confirm_password)) {
                    alert("Confirm password does not match!");
                } 
                else if (password.length < 6) {
                    alert("Password must be at least 6 characters long!")
                }
                else if (!letterRegex.test(password) || !numberRegex.test(password)) {
                    alert("Password must contain at least one letter and one number!");
                }
                else {
                    const new_account = {firstname,lastname,username, email, password};
                    const response = await fetch(flaskURL + '/create_account', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(new_account)
                    })
                    if (!response.ok) {
                        alert("Something went wrong, refresh your website!");
                    } else{
                        switch(response.status) {
                            case 201:
                                console.log("Create account successfully");
                                window.location.href = '/'
                                break;
                            case 205:
                                alert("Username has been used. Please change it to another one!");
                                break;
                        }
                    }
                } 
            }
            }>Create Account</button>
                <button onClick={() => { window.location.href = '/'}}>Go Back</button>
            </div>
        </div>
    );
}