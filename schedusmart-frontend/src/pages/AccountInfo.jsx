// This documentation is used for building create-account UI page

import { useState, useEffect } from "react";
import "./AccountInfo.css";
import languageData from "../components/language.json";

//this can be change when flask's ip become static
//currently it's localhost

const flaskURL = "http://127.0.0.1:5000";
const userId = sessionStorage.getItem('user_id');

export default function AccountInfo() {
    const handleInfo = async (event) => {
        const response = await fetch(flaskURL + '/user_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
            }),
            credentials: "include"
        });
        if (!response.ok) {
            alert("Account Info Not Found. Please log-out and log-in again")
        } else {
            switch(response.status) {
                case 201:
                    const responseData = await response.json();
                    const userId = responseData.user_id;
                    setFirstName(responseData.first_name);
                    setLastName(responseData.last_name);
                    setUsername(responseData.user_name);
                    setEmail(responseData.email);
                    console.log(userId);
                    break;
                case 202:
                    alert("User Not Found");
                    break;
                case 205:
                    alert("Failing to retrieve user data")
                    break;
            }
        }
    }

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('West Lafayette');

  return (
    <div className="info_container">
            <button onClick={handleInfo}>Reset to Default</button>
      <div>
        <h1> {languageData[0][0][0].accountInformation} </h1>
      </div>
      <div className="info">
        <label>
            {languageData[0][0][0].firstName} <input value={firstname} onChange={(e) => setFirstName(e.target.value)}/>
        </label>
      </div>
      <div className="info">
        <label>
            {languageData[0][0][0].lastName} <input value={lastname} onChange={(e) => setLastName(e.target.value)}/>
        </label>
      </div>
      <div className="info">
        <label>
            {languageData[0][0][0].userName} <input value={username} onChange={(e) => setUserName(e.target.value)}/>
        </label>
      </div>
      <div className="info">
        <label>
            {languageData[0][0][0].Email} <input value={email} onChange={(e) => setEmail(e.target.value)}/>
        </label>
      </div>
      <div className="info">
        <label>
            {languageData[0][0][0].location} <input value={location} onChange={(e) => setLocation(e.target.value)}/>
        </label>
      </div>
    </div>
  );
}
