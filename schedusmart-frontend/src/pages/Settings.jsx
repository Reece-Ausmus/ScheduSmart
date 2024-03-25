import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AccountInfo from "./AccountInfo.jsx";
import languageData from "../components/language.json";
import Reminder from "./Reminder";
import Calendar_Settings from "./Calendar_settings";
import send_request from "./requester.jsx";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from "@mui/material/colors";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

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
  const [Languages] = useState([
    { id: 0, value: 0, label: "English" },
    { id: 1, value: 1, label: "中文" },
    { id: 2, value: 2, label: "Español" },
  ]);
  const [language, setLanguage] = useState(0);
  const handleLanguageOption = (e) => {
    setLanguage(e.target.value)
  };

  return (
    <ThemeProvider theme={theme}>
      <h1>{languageData[language][0][0].setting}</h1>
      <div>{AccountInfo(language)}</div>
      <div>{Calendar_Settings()}</div>
      <div>{Reminder()}</div>
      <Card>
        <CardHeader subheader="Update language settings" title="Language" />
        <Divider />
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography variant="subtitle1" gutterBottom style={{ marginRight: '10px' }}>
              Language:
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="language">Option</InputLabel>
              <Select
                labelId="language"
                id="language"
                value={language}
                label="language"
                onChange={handleLanguageOption}
                style={{ minWidth: '120px' }}
              >
                {Languages.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </CardContent>
        <Divider />
      </Card>
      <h2>Other settings</h2>
      <button onClick={() => { window.location.href = "/calendar"; }}>
        {languageData[language][0][0].calendar}
      </button>
      <button onClick={() => { window.location.href = "/welcome"; }}>
        {languageData[language][0][0].signout}
      </button>
    </ThemeProvider >
  );
}
