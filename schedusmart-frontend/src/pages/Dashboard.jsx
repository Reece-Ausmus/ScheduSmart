import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "./MainFrame.css";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  red,
  orange,
  yellow,
  green,
  blue,
  purple,
  pink,
} from "@mui/material/colors";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import send_request from "./requester.jsx";
import {useLocation} from 'react-router-dom';
import languageLibrary from "../components/language.json";

const userId = sessionStorage.getItem("user_id");
const Colors = [
  { id: 0, value: { primary: red[500], secondary: red[400] }, label: "Red" },
  {
    id: 1,
    value: { primary: orange[300], secondary: orange[200] },
    label: "Orange",
  },
  {
    id: 2,
    value: { primary: yellow[300], secondary: yellow[200] },
    label: "Yellow",
  },
  {
    id: 3,
    value: { primary: green[200], secondary: green[100] },
    label: "Green",
  },
  { id: 4, value: { primary: blue[200], secondary: blue[100] }, label: "Blue" },
  {
    id: 5,
    value: { primary: purple[200], secondary: purple[100] },
    label: "Purple",
  },
  { id: 6, value: { primary: pink[200], secondary: pink[100] }, label: "Pink" },
];
const theme = createTheme({
  palette: {
    primary: orange,
    secondary: {
      main: "#ab5600",
    },
  },
});

export default function Dashboard(lang) {
  let language = 0;
  if (lang != undefined && lang != null) {
    language = lang;
  }
  let languageData = languageLibrary[language][0].dashBoard;
  const location = useLocation();
  let Color;
  if (location.state == null) {
    Color = sessionStorage.getItem('system_color');
  }
  else {
    Color = location.state.color_choice;
  }
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
            <Button color="inherit" href="./datapage" id="datapage-button">
              {languageData.data}
            </Button>
            <Button color="inherit" href="./habits" id="habits-button">
              {languageData.habits}
            </Button>
            <Button color="inherit" href="./friendlist" id="friendlist">
              {languageData.friendlist}
            </Button>
            <Button color="inherit" href="./notes" id="notes-button">
            {languageData.notes}
            </Button>
            <Button color="inherit" href="./notebook" id="notebook-button">
            {languageData.noteBook}
            </Button>
            <Button color="inherit" href="./taskmanager" id="task-manager">
            {languageData.taskManager}
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
              <MenuItem
                component="a"
                href="./settings"
                onClick={handleMenuClose}
              >
                {languageData.setting}
              </MenuItem>
              <MenuItem component="a"
                href="./welcome" onClick={handleConfirmClick}>{languageData.signOut}</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}
