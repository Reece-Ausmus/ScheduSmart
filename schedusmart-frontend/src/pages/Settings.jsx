import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AccountInfo from "./AccountInfo.jsx";
import languageData from "../components/language.json";
import Reminder from "./Reminder";
import Calendar_Settings from "./Calendar_settings";
// import "./Settings.css";
import send_request from "./requester.jsx";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from "@mui/material/colors";

const flaskURL = "http://127.0.0.1:5000";
const userId = sessionStorage.getItem("user_id");

const theme = createTheme({
  palette: {
    primary: orange,
    secondary: {
      main: "#ab5600",
    },
  },
});

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
  };
  const [language, setLanguage] = useState(0);
  const [showLanguageSettingUI, setShowLanguageSettingUI] = useState(false);
  const [locationMode, setLocationMode] = useState(() => {
    return localStorage.getItem('locationMode') || "text";
  });

  useEffect(() => {
    localStorage.setItem('locationMode', locationMode);
  }, [locationMode]);

  const toggleLocationMode = () => {
    const newLocationMode = locationMode === "text" ? "map" : "text";
    setLocationMode(newLocationMode);
    updateLocationSettings(newLocationMode);
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

  async function updateLocationSettings(location_mode) {
    if (userId === "undefined") {
      alert("userId disappear, so it will eventually fail");
      return;
    }
    const info = {
      mode: location_mode,
      user_id: userId,
    };
    const response = await fetch(flaskURL + "/update_location_settings", {
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
          console.log("Change location settings successfully");
          break;
        case 205:
          alert("Failed to change the location settings");
          break;
        default:
          alert("Unexpected response status: " + response.status);
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <h1>{languageData[language][0][0].setting}</h1>
      {showLanguageSettingUI && <div>{languageSettingUIPackage()}</div>}
      <div>{AccountInfo(language)}</div>
      <div>{Calendar_Settings()}</div>
      <div>{Reminder()}</div>
      <h2>Location settings</h2>
      <div>
        <button onClick={toggleLocationMode}>
          {locationMode === "text" ? "Choose Location from Map" : "Enter Location as Text"}
        </button>
      </div>
      <h2>Other settings</h2>
      <button onClick={() => { switchLanguageUI(); }}>
        {languageData[language][0][0].language}
      </button>
      <button onClick={() => { window.location.href = "/calendar"; }}>
        {languageData[language][0][0].calendar}
      </button>
      <button onClick={() => { window.location.href = "/welcome"; }}>
        {languageData[language][0][0].signout}
      </button>
    </ThemeProvider >
  );
}
