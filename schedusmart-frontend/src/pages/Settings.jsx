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


  return (
    <ThemeProvider theme={theme}>
      <h1>{languageData[language][0][0].setting}</h1>
      {showLanguageSettingUI && <div>{languageSettingUIPackage()}</div>}
      <div>{AccountInfo(language)}</div>
      <div>{Calendar_Settings()}</div>
      <div>{Reminder()}</div>
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
