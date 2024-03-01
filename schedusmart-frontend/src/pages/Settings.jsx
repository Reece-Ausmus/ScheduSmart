import Header from "../components/Header";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import AccountInfo from "./AccountInfo.jsx";
// import {LanguageProvider} from "./LanguageConfig.jsx";
import languageData from "../components/language.json";
import "./Settings.css";

const flaskURL = "http://127.0.0.1:5000";
const userId = sessionStorage.getItem("user_id");

export default function Settings() {
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
  }
  const [goToCalendar, setGoToCalendar] = useState(false);
  const [language, setLanguage] = useState(0);
  const [showLanguageSettingUI, setShowLanguageSettingUI] = useState(false);

  const [visualOptions] = useState([
    { id: 1, label: "day" },
    { id: 2, label: "week" },
    { id: 3, label: "month" },
    { id: 4, label: "year" },
  ]);
  const [showVirtual, setShowVirsual] = useState(3);
  const handleVirtualSelectChange = (e) => {
    setShowVirsual(parseInt(e.target.value));
    updateFormat(e.target.value);
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
      }
    }
  }

  return (
    <>
      <h1>{languageData[language][0][0].setting}</h1>
      {showLanguageSettingUI && <div>{languageSettingUIPackage()}</div>}
      <div>{AccountInfo(language)}</div>
      <button
        onClick={() => {
          switchLanguageUI();
        }}
      >
        {languageData[language][0][0].language}
      </button>
      <button
        onClick={() => {
          setGoToCalendar(true);
        }}
      >
        {languageData[language][0][0].calendar}
      </button>
      <button
        onClick={() => {
          window.location.href = "/reminder";
        }}
      >
        {languageData[language][0][0].Reminder}
      </button>
      <button
        onClick={() => {
          window.location.href = "/dashboard";
        }}
      >
        {languageData[language][0][0].dashBoard}
      </button>
      <button
        onClick={() => {
          window.location.href = "/welcome";
        }}
      >
        {languageData[language][0][0].signout}
      </button>
      <div className="reminder-settings">
        <p className="text"> {languageData[language][0][0].cvf}.:</p>
        <select value={showVirtual} onChange={handleVirtualSelectChange}>
          {visualOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

/*
<LanguageSetting.Provider
        value={{ language, setLanguage }}
      ></LanguageSetting.Provider>
*/
