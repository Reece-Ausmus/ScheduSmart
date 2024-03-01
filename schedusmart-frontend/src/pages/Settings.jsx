import Header from "../components/Header";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import AccountInfo from "./AccountInfo.jsx";
import LanguageSetting from "./LanguageConfig.jsx";
import languageData from "../components/language.json";

export default function Settings() {
  const [goToCalendar, setGoToCalendar] = React.useState(false);
  const [language, setLanguage] = useState(0);

  if (goToCalendar) {
    return (
      <>
        <Navigate to="/calendar" />
      </>
    );
  }

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
      <button
        onClick={() => {
          setGoToCalendar(true);
        }}
      >
        Calendar
      </button>
      <LanguageSetting.Provider
        value={{ language, setLanguage }}
      ></LanguageSetting.Provider>
    </>
  );
}
