import Header from "../components/Header";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import AccountInfo from "./AccountInfo.jsx";
import {LanguageProvider} from "./LanguageConfig.jsx";
import languageData from "../components/language.json";
import "./Settings.css";

export default function Settings() {
  const [goToCalendar, setGoToCalendar] = React.useState(false);
  const [language, setLanguage] = useState(0);
  const [showLanguageSettingUI, setShowLanguageSettingUI] = useState(false);

  function switchLanguageUI() {
    setShowLanguageSettingUI(!showLanguageSettingUI);
  }
  function languageSettingUIPackage() {
    return (
      <div className="languageSettingBox">
        <button className = "languageSettingButton" onClick={() => {
          setLanguage(0);
          switchLanguageUI();
        }}>english</button><br/>
        <button className = "languageSettingButton" onClick={() => {
          setLanguage(1);
          switchLanguageUI();
        }}>中文</button>
        <button className = "languageSettingButton" onClick={() => {
          setLanguage(1);
          switchLanguageUI();
        }}>Español</button>
        <br/>
        <button className = "languageSettingButton" onClick={() => {
          switchLanguageUI();
        }}>{languageData[language][0][0].cancel}</button>
      </div>
    )
  }
  if (goToCalendar) {
    return(
        <>
        <div>
        <Header/>
        <h2>Settings!</h2>
        <button onClick={() => {window.location.href = '/dashboard'}}>Dashboard</button>
        <button onClick={() => {window.location.href = '/welcome'}}>Sign Out</button>
        <button onClick={() => {window.location.href = '/reminder'}}>Reminder</button>
        </div>
        <Weather/> 
        </>
    );
  }

  return (
    <>
      <h1>{languageData[language][0][0].setting}</h1>
      {showLanguageSettingUI && (
        <div>{languageSettingUIPackage()}</div>
      )}
      {AccountInfo(language)}
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
      <button onClick={() => {window.location.href = '/reminder'}}>Reminder</button>
      <button onClick={() => {window.location.href = '/dashboard'}}>Dashboard</button>
      <button onClick={() => {window.location.href = '/welcome'}}>Sign Out</button>

    </>
  );
}      