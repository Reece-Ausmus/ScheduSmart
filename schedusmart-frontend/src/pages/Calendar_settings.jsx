import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import languageLibrary from "../components/language.json";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red, orange, yellow, green, blue, purple, pink } from "@mui/material/colors";
import { useLocation } from 'react-router-dom';

const flaskURL = "http://127.0.0.1:5000";
const userId = sessionStorage.getItem("user_id");
const Colors = [
  { id: 0, value: { primary: red[500], secondary: red[400] }, label: "Red" },
  { id: 1, value: { primary: orange[300], secondary: orange[200] }, label: "Orange" },
  { id: 2, value: { primary: yellow[300], secondary: yellow[200] }, label: "Yellow" },
  { id: 3, value: { primary: green[200], secondary: green[100] }, label: "Green" },
  { id: 4, value: { primary: blue[200], secondary: blue[100] }, label: "Blue" },
  { id: 5, value: { primary: purple[200], secondary: purple[100] }, label: "Purple" },
  { id: 6, value: { primary: pink[200], secondary: pink[100] }, label: "Pink" },
];

export default function Calendar_Settings(language,Color) {
  const languageData = languageLibrary[language][0].calendar_settings;
  const theme = createTheme({
    palette: {
      primary: {
        main: Colors[Color].value.primary,
      },
      secondary: {
        main: Colors[Color].value.secondary,
      },
    },
  });
  // calendar virsualization settings
  const [showVirtual, setShowVirsual] = useState(() => { return parseInt(sessionStorage.getItem('showVirtual')) || 1; });
  useEffect(() => {
    sessionStorage.setItem('showVirtual', showVirtual.toString());
  }, [showVirtual]);

  const handleVirtualSelectChange = (e) => {
    setShowVirsual(parseInt(e.target.value));
    updateFormat(parseInt(e.target.value));
  };

  async function updateFormat(calendar_mode) {
    if (userId === "undefined") {
      alert("userId disappear, so it will eventually fail");
      return;
    }
    const info = {
      mode: calendar_mode,
      user_id: userId,
    };
    const response = await fetch(flaskURL + "/update_calendar_format", {
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
          break;
        case 205:
          alert("Failed to change the calendar mode");
          break;
        default:
          alert("Unexpected response status: " + response.status);
      }
    }
  }

  // location input settings
  const [locationMode, setLocationMode] = useState(() => {
    return sessionStorage.getItem('locationMode') || "text";
  });

  useEffect(() => {
    sessionStorage.setItem('locationMode', locationMode);
  }, [locationMode]);

  const handleLocationSelectChange = (e) => {
    setLocationMode(e.target.value);
    updateLocationSettings(e.target.value);
  };
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
      <Card>
        <CardHeader subheader={languageData.updateCalSetting} title={languageData.Calendar} />
        <Divider />
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography variant="subtitle1" gutterBottom style={{ marginRight: '10px' }}>
              {languageData.calVis}
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="visual_format">{languageData.Visualization}</InputLabel>
              <Select
                labelId="v_format"
                id="visual_format"
                value={showVirtual}
                label="visual_format"
                onChange={handleVirtualSelectChange}
                style={{ minWidth: '120px' }}
              >
                <MenuItem value={1}>{languageData.day}</MenuItem>
                <MenuItem value={2}>{languageData.week}</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography variant="subtitle1" gutterBottom style={{ marginRight: '10px' }}>
              {languageData.locationIn}
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="location_format">{languageData.setting}</InputLabel>
              <Select
                labelId="l_format"
                id="location_format"
                value={locationMode}
                label="location_format"
                onChange={handleLocationSelectChange}
                style={{ minWidth: '120px' }}
              >
                <MenuItem value={"text"}>{languageData.enterLocTxt}</MenuItem>
                <MenuItem value={"map"}>{languageData.chooseLocMap}</MenuItem>
              </Select>
            </FormControl>
          </div>
        </CardContent>
        <Divider />
        {/* <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">Save</Button>
        </CardActions> */}
      </Card>
    </ThemeProvider>
  );
}