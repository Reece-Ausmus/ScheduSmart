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
        const response = await fetch(flaskURL + '/login', {
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
                    console.log("user found");
                    const responseData = await response.json();
                    const userId = responseData.user_id;
                    setFirstName(responseData.first_name);
                    setLastName(responseData.last_name);
                    setUsername(responseData.user_name);
                    setEmail(responseData.email);
                    setPassword(responseData.password);
                    break;
                case 202:
                    alert("User Not Found");
                    break;
                case 205:
                    alert("Server Issue. Please exit and try to reconnect")
                    break; 
            }
        }
    }


    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('West Lafayette');

  return (
    <div className="info_container">
      <div>
        <h1> {languageData[language][0][0].accountInformation} </h1>
      </div>
      <div className="info">
        <p>{languageData[language][0][0].firstName}: {firstname}</p>
      </div>
      <div className="info">
        <p>{languageData[language][0][0].lastName}: {lastname}</p>
      </div>
      <div className="info">
        <p>{languageData[language][0][0].userName}: {username}</p>
      </div>
      <div className="info">
        <p>{languageData[language][0][0].Email}: {email}</p>
      </div>
      <div className="info">
        <p>{languageData[language][0][0].password}: {password}</p>
      </div>
      <div className="info">
        <p>{languageData[language][0][0].location}: {location}</p>
      </div>
    </div>
  );
}
