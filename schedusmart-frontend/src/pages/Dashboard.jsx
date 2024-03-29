import Header from '../components/Header'
import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom'
import './MainFrame.css'
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar, Toolbar } from "@mui/material";
import { orange, yellow } from "@mui/material/colors";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Typography from "@mui/material/Typography";

const theme = createTheme({
  palette: {
    primary: {
      main: orange[500],
    },
    secondary: {
      main: "#ab5600",
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
            <Button color="inherit" href="./settings">
              Settings
            </Button>
            <Button color="inherit" onClick={handleConfirmClick}>
              Sign Out
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

