import Header from '../components/Header'
import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom'
import './MainFrame.css'
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar, Toolbar, Typography, Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import { orange } from "@mui/material/colors";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const theme = createTheme({
  palette: {
    primary: {
      main: orange[500],
    },
    secondary: {
      main: "#ab5600"
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: "gray",
        },
      },
    },
  },
});

export default function Dashboard() {
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
      //Yes
      sessionStorage.clear();
      setGoToWelcome(true);
    } 
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Button variant="contained" href="./calendar">
            <CalendarMonthIcon sx={{ marginRight: 1 }} />
            <Typography variant="body1">ScheduSmart</Typography>
          </Button>
          <div>
            <Button variant="inherit" href="./calendar">
              <CalendarMonthIcon sx={{ marginRight: 1 }} />
            </Button>
            <Button color="inherit" href="./habits">
              Habits
            </Button>
            <Button color="inherit" href="./notes">
              Notes
            </Button>
            <Button color="inherit" href="./taskmanager">
              Task manager
            </Button>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              aria-controls="profile-menu"
              aria-haspopup="true"
              edge="end"
            >
              <AccountCircleIcon/>
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
