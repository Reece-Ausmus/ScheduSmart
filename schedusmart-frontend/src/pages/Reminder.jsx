import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import languageLibrary from "../components/language.json";
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red, orange, yellow, green, blue, purple, pink } from "@mui/material/colors";
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import send_request from "./requester";
import EmailForm from "../components/Email";

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

export default function Reminder(language, Color) {
  const languageData = languageLibrary[language][0].Reminder;
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

  //Implementation of ISO switch
  const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#EF6C00' : '#FFA726',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

  //Implementation of reminders settings
  const [remindersOn, setRemindersOn] = useState(false);
  const [Events, setEvents] = useState();
  const [firstEvents, setFirstEvents] = useState();
  const handleReminderChange = () => {
    setRemindersOn((prevRemindersOn) => {
      const newRemindersOn = !prevRemindersOn;
      console.log(newRemindersOn);
      if (newRemindersOn) {
        get_users_all_events();
      }
      return newRemindersOn;
    });
  };

  // compare dates and times
  const compareDates = (d1, d2) => {
    let date1 = new Date(d1).getTime();
    let date2 = new Date(d2).getTime();

    if (date1 < date2) {
      return -1;
    } else if (date1 > date2) {
      return 1;
    } else {
      return 0;
    }
  };
  const compareTimes24 = (time1, time2) => {
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);

    if (hours1 < hours2 || (hours1 === hours2 && minutes1 < minutes2)) {
      return -1;
    } else if (hours1 > hours2 || (hours1 === hours2 && minutes1 > minutes2)) {
      return 1;
    } else {
      return 0;
    }
  };
  const compareDatesAndTimes = (datetime1, datetime2) => {
    const [date1, time1] = datetime1.split(" ");
    const [date2, time2] = datetime2.split(" ");
    const dateComparison = compareDates(date1, date2);
    if (dateComparison !== 0) {
      if (dateComparison == -1) {
        console.log(`${datetime1} is less than ${datetime2}`);
        return -1;
      }
      else if (dateComparison == -1) {
        console.log(`${datetime1} is greater than ${datetime2}`);
        return 1;
      }
    } else {
      const timeComparison = compareTimes24(time1, time2);
      if (timeComparison == -1) {
        console.log(`${datetime1} is less than ${datetime2}`);
        return -1;
      }
      else if (timeComparison == 1) {
        console.log(`${datetime1} is greater than ${datetime2}`);
        return 1;
      }
      else if (timeComparison == 0) {
        console.log(`${datetime1} and ${datetime2} are equal`);
        return 0;
      }
    }
  };
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  useEffect(() => {
    console.log(formattedDate); 
  }, []);

  const get_users_all_events = async () => {
    const response = await send_request("/get_event_with_userid", { "user_id": userId })
    const events = response.data;
    console.log(events);
    events.sort((a, b) => compareDatesAndTimes(`${a["start_date"]} ${a["start_time"]}`, `${b["start_date"]} ${b["start_time"]}`))
    console.log(events);
    setEvents(events);
    setFirstEvents(events[0]);
  }

  const [timeOptions] = useState([
    { id: 5, value: 5 },
    { id: 10, value: 10 },
    { id: 15, value: 15 },
    { id: 30, value: 30 },
    { id: 60, value: 60 },
  ]);
  const [selectedTimeOption, setSelectedTimeOption] = useState(10);
  const handleTimeSelectChange = (e) => {
    setSelectedTimeOption(parseInt(e.target.value));
  };

  const [reminderOptions] = useState([
    { id: 1, label: languageData.browserNoti, value: 1 },
    { id: 2, label: languageData.email, value: 2 },
  ]);
  const [selectReminderOptions, setReminderOptions] = useState(() => { return parseInt(localStorage.getItem('reminder_option')) || 1; });
  useEffect(() => {
    localStorage.setItem('reminder_option', selectReminderOptions.toString());
  }, [selectReminderOptions]);
  const handleReminderOptionsChange = (e) => {
    setReminderOptions(parseInt(e.target.value));
    updatereminderoption(parseInt(e.target.value));
  };
  function handleSendEmail(event_R) {
    let message = "Here are the reminders from Schedusmart:\n\n";

    // const temp = events[i].title + ": " + events[i].content + "\n";
    const row1 = "Events:"+event_R["name"]+"\n";
    const row2 = "Description:"+event_R["desc"] + "\n";
    const row3 = "Start_Time: "+event_R["start_date"] + " "+event_R["start_time"]+"\n";
    const row4 = "End_Time: "+event_R["end_date"] + " "+event_R["end_time"]+"\n";
    const row5 = "Location: "+event_R["location"]+"\n";
    const row6 = "Confenrence link: "+event_R["confenrence_link"]+"\n";
    message += row1+row2+row3+row4+row5;
    console.log(message)
    EmailForm(name, email, message);
    handleShowEmailPopup()

  }
  async function updatereminderoption(reminder_option) {
    console.log(reminder_option);
    const response = await send_request("/update_reminders_options", { "user_id": userId, "r_option": reminder_option })
    if (reminder_option == 2) {
      handleSendEmail();
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader subheader={languageData.updateReminderSetting} title={languageData.Reminder} />
        <Divider />
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography variant="subtitle1" gutterBottom style={{ marginRight: '10px' }}>
              {languageData.Reminder + ":"}
            </Typography>
            <FormControlLabel
              control={
                <IOSSwitch
                  sx={{ m: 1 }}
                  defaultChecked={remindersOn}
                  onChange={handleReminderChange}
                />
              }
              label={remindersOn ? 'On' : 'Off'}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography variant="subtitle1" gutterBottom style={{ marginRight: '10px' }}>
              {languageData.ReminderMe}
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="reminder_time">{languageData.Time}</InputLabel>
              <Select
                labelId="r_time"
                id="reminder_time"
                value={selectedTimeOption}
                label="reminderTime"
                onChange={handleTimeSelectChange}
                style={{ minWidth: '120px' }}
              >
                {timeOptions.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {option.value} {"minutes before"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography variant="subtitle1" gutterBottom style={{ marginRight: '10px' }}>
              {languageData.howUwantbeNotified}
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="reminder_option">{languageData.Option}</InputLabel>
              <Select
                labelId="r_option"
                id="reminder_option"
                value={selectReminderOptions}
                label="reminderOption"
                onChange={handleReminderOptionsChange}
                style={{ minWidth: '120px' }}
              >
                <MenuItem key={1} value={1}>
                  {languageData.browserNoti}
                </MenuItem>
                <MenuItem key={2} value={2}>
                  {languageData.email}
                </MenuItem>
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
