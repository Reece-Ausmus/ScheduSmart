// This documentation is used for building create-account UI page

import { useState, useEffect } from "react";
import "./AccountInfo.css";
import languageData from "../components/language.json";

//this can be change when flask's ip become static
//currently it's localhost

const flaskURL = "http://127.0.0.1:5000";
const userId = sessionStorage.getItem("user_id"); //"Sup3XDcQrNUm6CGdIJ3W5FHyPpQ2";

export default function AccountInfo(language) {
  const handleInfo = async (event) => {
    const response = await fetch(flaskURL + "/user_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
      }),
      credentials: "include",
    });
    if (!response.ok) {
      alert("Account Info Not Found. Please log-out and log-in again");
    } else {
      switch (response.status) {
        case 201:
          const responseData = await response.json();
          const userId = responseData.user_id;
          setFirstName(responseData.first_name);
          setLastName(responseData.last_name);
          setUsername(responseData.user_name);
          setEmail(responseData.email);
          if (responseData.location != null) setLocation(responseData.location);
          console.log(userId);
          break;
        case 202:
          alert("User Not Found");
          break;
        case 205:
          alert("Failing to retrieve user data");
          break;
      }
    }
  };

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("West Lafayette");

  useEffect(() => {
    handleInfo();
  }, []);

  return (
    <div className="info_container">
      <button onClick={handleInfo}>{languageData[language][0][0].restToDefault}</button>
      <div>
        <h1> {languageData[language][0][0].accountInformation} </h1>
      </div>
      <div className="info">
        <label>
          {languageData[language][0][0].firstName}{" "}
          <input
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
      </div>
      <div className="info">
        <label>
          {languageData[language][0][0].lastName}{" "}
          <input
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
      </div>
      <div className="info">
        <label>
          {languageData[language][0][0].userName}{" "}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>
      <div className="info">
        <label>
          {languageData[language][0][0].email}{" "}
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>
      <div className="info">
        <label>
          {languageData[language][0][0].location}{" "}
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
      </div>
      <button
        onClick={async () => {
          const regex = /[\\"\s\'\\\x00-\x1F\x7F]/g;

          if (!lastname.localeCompare("") || !firstname.localeCompare("")) {
            alert("Please fill up your name!");
          } else if (!username.localeCompare("")) {
            alert("Please fill up your username!");
          } else if (!email.localeCompare("")) {
            alert("Please fill up your email!");
          } else if (
            regex.test(firstname) ||
            regex.test(lastname) ||
            regex.test(username)
          ) {
            alert(
              "Input contains special characters. Please remove them and try again!"
            );
          } else {
            const info = {
              first_name: firstname,
              last_name: lastname,
              user_name: username,
              email: email,
              user_id: userId,
              location: location, 
            };
            const response = await fetch(flaskURL + "/update_account_info", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify(info),
            });
            if (!response.ok) {
              alert("something went wrong, refresh your website");
            } else {
              switch (response.status) {
                case 201:
                  console.log("Updated account info!");
                  break;
                case 205:
                  console.log("Failed to update account");
                  alert("Failed to update account! Check New Information!");
                  break;
                case 206:
                  console.log("Missing info");
                  alert("Failed to update account!");
                  break;
              }
            }
          }
        }}
      >
        {languageData[language][0][0].Updateaccount}
      </button>
    </div>
  );
}
