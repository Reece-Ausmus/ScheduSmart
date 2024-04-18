import React, { useState, useEffect,useHistory } from "react";
import { Navigate } from "react-router-dom";
import AccountInfo from "./AccountInfo.jsx";
import languageData from "../components/language.json";
import Reminder from "./Reminder";
import Calendar_Settings from "./Calendar_settings";
import send_request from "./requester.jsx";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red, orange, yellow, green, blue, purple, pink } from "@mui/material/colors";
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
import { useNavigate } from "react-router-dom";

const flaskURL = "http://127.0.0.1:5000";
const userId = sessionStorage.getItem("user_id");
const Colors = [
  { id: 0, value: {primary:red[500],secondary:red[400]}, label: "Red" },
  { id: 1, value: {primary:orange[300],secondary:orange[200]}, label: "Orange" },
  { id: 2, value: {primary:yellow[300],secondary:yellow[200]}, label: "Yellow" },
  { id: 3, value: {primary:green[200],secondary:green[100]}, label: "Green" },
  { id: 4, value: {primary:blue[200],secondary:blue[100]}, label: "Blue" },
  { id: 5, value: {primary:purple[200],secondary:purple[100]}, label: "Purple" },
  { id: 6, value: {primary:pink[200],secondary:pink[100]}, label: "Pink" },
];

export default function Settings() {
  //initialized data load from db
  const navigate = useNavigate();
  const fetchInitializeData = async () => {
    let dataOfUser = await send_request("/user_data", {
      "user_id": userId,
    });
    if (dataOfUser.language != undefined) {
      setLanguage(dataOfUser.language);
    }
  };
  const [Languages] = useState([
    { id: 0, value: 0, label: "English" },
    { id: 1, value: 1, label: "中文" },
    { id: 2, value: 2, label: "Español" },
  ]);
  const [language, setLanguage] = useState(0);
  const handleLanguageOption = (e) => {
    setLanguage(e.target.value);
    send_request("/change_language", {"user_id": userId, "language": e.target.value})
  };
  const [Color, setColor] = useState(() => { return (parseInt(sessionStorage.getItem('system_color'))?parseInt(sessionStorage.getItem('system_color')):1); });
  const getColorOption = async () => {
    const response = await send_request("/get_system_color", { "user_id": userId});
    setColor(response.type);
  };
  useEffect(() => {
    getColorOption();
    fetchInitializeData();
  }, [])
  useEffect(() => {
    sessionStorage.setItem('system_color', Color.toString());
    navigate('/settings', { state:{color_choice:Color}});
  }, [Color]);

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
  

  return (
    <ThemeProvider theme={theme}>
      <div>{Dashboard(language)}</div>
      <h1 style={{ color: theme.palette.primary.main }}>{languageData[language][0].setting.setting}</h1>
      <div>{AccountInfo(language,Color)}</div>
      <div>{Calendar_Settings(language,Color)}</div>
      <div>{Reminder(language,Color)}</div>
      <Card>
        <CardHeader subheader={languageData[language][0].setting.UpdateLanguageSettings} title={languageData[language][0].setting.Language} />
        <Divider />
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography variant="subtitle1" gutterBottom style={{ marginRight: '10px' }}>
              {languageData[language][0].setting.Language + ':'}
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="language">{languageData[language][0].setting.Option}</InputLabel>
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
          <CardHeader subheader={languageData[language][0].setting.UpdateSystemSettings} 
                      title={languageData[language][0].setting.system} />
          <Divider />
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Typography variant="subtitle1" gutterBottom style={{ marginRight: '10px' }}>
                {languageData[language][0].setting.Option + ":"}
              </Typography>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="system_color">{languageData[language][0].setting.Option}</InputLabel>
                <Select
                  labelId="system_color"
                  id="system_color"
                  value={Color}
                  label="color"
                  onChange={handleColorSelectChange}
                  style={{ minWidth: '120px' }}
                >
                  {Colors.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
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
