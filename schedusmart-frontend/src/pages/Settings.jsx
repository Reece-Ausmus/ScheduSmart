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
import Dashboard from "./Dashboard";


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

  const [Colors] = useState([
    { id: 0, value: 0, label: "Red" },
    { id: 1, value: 1, label: "Orange" },
    { id: 2, value: 2, label: "Yellow" },
    { id: 3, value: 4, label: "Green" },
    { id: 4, value: 4, label: "Blue" },
    { id: 5, value: 5, label: "Purple" },
    { id: 6, value: 6, label: "Pink" },
  ]);

  const [Color, setColor] = useState(1);
  const handleColorOption = async (Color) => {
    const response = await send_request("/change_system_color", { "user_id": userId, "color": Color });
    if (response.error != undefined) {
      if (response.error == "system color settings can not be changed") {
        alert("system color settings can not be changed.");
        return;
      }
      if (response.error == "missing information") {
        alert("The information is missing.");
        return;
      }
    }
  };

  const handleColorSelectChange = (e) => {
    setColor(e.target.value);
    handleColorOption(e.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>{Dashboard()}</div>
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
      <div style={{ paddingBottom: '50px' }}>
        <Card>
          <CardHeader subheader="Update system settings" title="system" />
          <Divider />
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Typography variant="subtitle1" gutterBottom style={{ marginRight: '10px' }}>
                Color:
              </Typography>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="system_color">Option</InputLabel>
                <Select
                  labelId="system_color"
                  id="system_color"
                  value={Color}
                  label="color"
                  onChange={handleColorSelectChange}
                  style={{ minWidth: '120px' }}
                >
                  {Colors.map((option) => (
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
      </div>
    </ThemeProvider >
  );
}
