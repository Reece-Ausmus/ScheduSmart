import Header from '../components/Header'
import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom'
import './MainFrame.css'
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar, Toolbar, Typography, Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import { red, orange, yellow, green, blue, purple, pink } from "@mui/material/colors";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import send_request from "./requester.jsx";

const userId = sessionStorage.getItem("user_id");
const Colors = [
  { id: 0, value: {primary:red[200],secondary:red[100]}, label: "Red" },
  { id: 1, value: {primary:orange[200],secondary:orange[100]}, label: "Orange" },
  { id: 2, value: {primary:yellow[200],secondary:yellow[100]}, label: "Yellow" },
  { id: 3, value: {primary:green[200],secondary:green[100]}, label: "Green" },
  { id: 4, value: {primary:blue[200],secondary:blue[100]}, label: "Blue" },
  { id: 5, value: {primary:purple[200],secondary:purple[100]}, label: "Purple" },
  { id: 6, value: {primary:pink[200],secondary:pink[100]}, label: "Pink" },
];

export default function Dashboard() {
  const [Color, setColor] = useState(() => { return parseInt(localStorage.getItem('systemcolor')) || 1;});
  const getColorOption = async () => {
    let response = await send_request("/get_system_color", { "user_id": userId});
    if (response.type == undefined)return;
    setColor(response.type);
  };
  useEffect(() => {
    getColorOption();
}, []);
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

  const [goToWelcome, setGoToWelcome] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (goToWelcome) {
    return (
      <>
        <Navigate to="/welcome" />
      </>
    );
  }
  const handleConfirmClick = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      sessionStorage.clear();
      setGoToWelcome(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Button variant="contained" href="./calendar" id="calendar-button">
            <CalendarMonthIcon sx={{ marginRight: 1 }} />
            <Typography variant="body1">ScheduSmart</Typography>
          </Button>
          <div>
            <Button variant="inherit" href="./calendar">
              <CalendarMonthIcon sx={{ marginRight: 1 }} />
            </Button>
            <Button color="inherit" href="./habits" id="habits-button">
              Habits
            </Button>
            <Button color="inherit" href="./friendlist" id="friendlist">
              Friendlist
            </Button>
            <Button color="inherit" href="./notes" id="notes-button">
              Notes
            </Button>
            <Button color="inherit" href="./taskmanager" id="task-manager">
              Task manager
            </Button>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              aria-controls="profile-menu"
              aria-haspopup="true"
              edge="end"
              id="profile-menu"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component="a" href="./settings" onClick={handleMenuClose}>
                Settings
              </MenuItem>
              <MenuItem onClick={handleConfirmClick}>Sign Out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}
