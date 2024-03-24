import React, { useState } from "react";
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
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from "@mui/material/colors";
import { styled } from '@mui/material/styles';

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

export default function Reminder() {
  const [remindersOn, setRemindersOn] = useState(false);
  const handleReminderChange = () => {
    setRemindersOn((remindersOn) => !remindersOn);
  };

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
    { id: 1, label: "Browser notification", value: 1 },
    { id: 2, label: "Email", value: 2 },
    { id: 3, label: "Mobile notification", value: 3 },
  ]);
  const [selectReminderOptions, setReminderOptions] = useState(1)
  const handleReminderOptionsChange = (e) => {
    setReminderOptions(parseInt(e.target.value));
  };


  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader subheader="Update reminders settings" title="Reminder" />
        <Divider />
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography variant="subtitle1" gutterBottom style={{ marginRight: '10px' }}>
              Reminders:
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
              Remind me:
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="reminder_time">Time</InputLabel>
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
                    {option.value} minutes before
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography variant="subtitle1" gutterBottom style={{ marginRight: '10px' }}>
              How do you want to be notified?
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="reminder_option">Option</InputLabel>
              <Select
                labelId="r_option"
                id="reminder_option"
                value={selectReminderOptions}
                label="reminderOption"
                onChange={handleReminderOptionsChange}
                style={{ minWidth: '120px' }}
              >
                {reminderOptions.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">Save</Button>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}
