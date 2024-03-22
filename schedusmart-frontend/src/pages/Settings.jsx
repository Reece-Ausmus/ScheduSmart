import Header from "../components/Header";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import AccountInfo from "./AccountInfo.jsx";
import languageData from "../components/language.json";
import Reminder from "./Reminder";
import "./Settings.css";
import send_request from "./requester.jsx";

const flaskURL = "http://127.0.0.1:5000";

export default function Settings() {
  const userId = sessionStorage.getItem("user_id");
  const fetchLanguage = async () => {
    const response = await fetch(flaskURL + "/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
      }),
      credentials: "include",
    });
  };
  const [language, setLanguage] = useState(0);
  const [showLanguageSettingUI, setShowLanguageSettingUI] = useState(false);
  const [showVirtual, setShowVirsual] = useState(3);
  const [visualOptions] = useState([
    { id: 1, label: "day", value: 1 },
    { id: 2, label: "week", value: 2 },
    { id: 3, label: "month", value: 3 },
    { id: 4, label: "year", value: 4 },
  ]);
  const handleVirtualSelectChange = (e) => {
    setShowVirsual(parseInt(e.target.value));
    console.log(parseInt(e.target.value));
    updateFormat(parseInt(e.target.value));
  };
  function switchLanguageUI() {
    setShowLanguageSettingUI(!showLanguageSettingUI);
  }
  function languageSettingUIPackage() {
    return (
      <div className="languageSettingBox">
        <button
          className="languageSettingButton"
          onClick={() => {
            setLanguage(0);
            switchLanguageUI();
          }}
        >
          english
        </button>
        <br />
        <button
          className="languageSettingButton"
          onClick={() => {
            setLanguage(1);
            switchLanguageUI();
          }}
        >
          中文
        </button>
        <button
          className="languageSettingButton"
          onClick={() => {
            setLanguage(2);
            switchLanguageUI();
          }}
        >
          Español
        </button>
        <br />
        <button
          className="languageSettingButton"
          onClick={() => {
            switchLanguageUI();
          }}
        >
          {languageData[language][0][0].cancel}
        </button>
      </div>
    );
  }

  async function updateFormat(calendar_mode) {
    if (userId === "undefined") {
      alert("userId disappear, so it will eventually fail");
      return;
    }
    const info = {
      mode: calendar_mode,
      user_id: userId,
    };
    const response = await fetch(flaskURL + "/update_format", {
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
          console.log("Change calendar format successfully");
          const responseData = await response.json();
          const userId = responseData.user_id;
          sessionStorage.setItem("user_id", userId);
          break;
        case 205:
          alert("Failed to change the calendar mode");
          break;
        default:
          alert("Unexpected response status: " + response.status);
      }
    }
  }

  return (
    <>
      <h1>{languageData[language][0][0].setting}</h1>
      {showLanguageSettingUI && <div>{languageSettingUIPackage()}</div>}
      <div>{AccountInfo(language)}</div>
      <div>{Reminder()}</div>
      <h2>virtualization settings</h2>
      <div className="virtualization-settings reminder-settings">
        <p className="text"> {languageData[language][0][0].cvf}:</p>
        <select value={showVirtual} onChange={handleVirtualSelectChange}>
          {visualOptions.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button onClick={() => {switchLanguageUI();}}>
        {languageData[language][0][0].language}
      </button>
      <button onClick={() => {window.location.href = "/calendar";}}>
        {languageData[language][0][0].calendar}
      </button>
      <button onClick={() => {window.location.href = "/welcome";}}>
        {languageData[language][0][0].signout}
      </button>
    </>
  );
}
