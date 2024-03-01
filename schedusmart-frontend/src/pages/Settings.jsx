import Header from "../components/Header";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import AccountInfo from "./AccountInfo.jsx";
import LanguageSetting from "./LanguageConfig.jsx";
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

  return (
    <>
      <h1>Settings</h1>
      <AccountInfo />
      <button
        onClick={() => {
          setLanguage(1);
          console.log(languageData[1].welcome);
        }}
      >
        language
      </button>
      <button onClick={() => {
        setGoToCalendar(true);
      }}>
        Calendar
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