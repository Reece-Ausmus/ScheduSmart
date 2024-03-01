import Header from "../components/Header";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import AccountInfo from "./AccountInfo.jsx";
//import {LanguageProvider} from "./LanguageConfig.jsx";
import languageData from "../components/language.json";
import './Settings.css';

export default function Settings() {
  const [goToCalendar, setGoToCalendar] = useState(false);
  const [language, setLanguage] = useState(0);
  const [showLanguageSettingUI, setShowLanguageSettingUI] = useState(false);

  const [visualOptions] = useState([
    { id: 1, label: 'day' },
    { id: 2, label: 'week' },
    { id: 3, label: 'month' },
    { id: 4, label: 'year' },
  ]);
  const [showVirtual, setShowVirsual] = useState(3);
  const handleVirtualSelectChange = (e) => {
    setShowVirsual(parseInt(e.target.value));
  };

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
      <button onClick={() => { window.location.href = '/reminder' }}>Reminder</button>
      <button onClick={() => { window.location.href = '/dashboard' }}>Dashboard</button>
      <button onClick={() => { window.location.href = '/welcome' }}>Sign Out</button>
      <LanguageSetting.Provider
        value={{ language, setLanguage }}
      ></LanguageSetting.Provider>
      <dev className="reminder-settings">
        <p className='text'>visualization format:</p>
        <select value={showVirtual} onChange={handleVirtualSelectChange}>
          {visualOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </dev>
    </>
  );
}      