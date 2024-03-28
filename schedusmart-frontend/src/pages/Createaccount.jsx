// This documentation is used for building create-account UI page
import { useState } from "react";
import "./Createaccount.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar, IconButton, Menu, Toolbar } from "@mui/material";
import { orange } from "@mui/material/colors";

//this can be change when flask's ip become static
//currently it's localhost

const flaskURL = "http://127.0.0.1:5000";

const theme = createTheme({
  palette: {
    primary: orange,
    secondary: {
      main: "#ab5600",
    },
  },
});

export default function Createaccount() {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const firstname = document.getElementById("firstName").value;
    const lastname = document.getElementById("lastName").value;
    const username = document.getElementById("userName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirmPassword").value;

    const letterRegex = /[a-zA-Z]/;
    const numberRegex = /[0-9]/;
    const regex = /[\\"\s\'\\\x00-\x1F\x7F]/g;

    if (!lastname.localeCompare("") && !firstname.localeCompare("")) {
      alert("Please fill up your name!");
      return;
    } else if (!username.localeCompare("")) {
      alert("Please fill up your username!");
      return;
    } else if (!email.localeCompare("")) {
      alert("Please fill up your email!");
      return;
    } else if (!password.localeCompare("")) {
      alert("Please fill up your password!");
      return;
    } else if (
      regex.test(firstname) ||
      regex.test(lastname) ||
      regex.test(username) ||
      regex.test(password) ||
      regex.test(confirm_password)
    ) {
      alert(
        "Input contains special characters. Please remove them and try again!"
      );
      return;
    } // avoid special characters in input
    else if (password.localeCompare(confirm_password)) {
      alert("Confirm password does not match!");
      return;
    } else if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    } else if (!letterRegex.test(password) || !numberRegex.test(password)) {
      alert("Password must contain at least one letter and one number!");
      return;
    }
    const new_account = { firstname, lastname, username, email, password };
    const response = await fetch(flaskURL + "/create_account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_account),
      credentials: "include",
    });
    if (!response.ok) {
      alert("Something went wrong, refresh your website!");
    } else {
      switch (response.status) {
        case 201:
          console.log("Create account successfully");
          const responseData = await response.json();
          const userId = responseData.user_id;
          sessionStorage.setItem("user_id", userId);
          window.location.href = "./signin";
          break;
        case 205:
          alert("Username has been used. Please change it to another one!");
          break;
      }
    }

    // add initial calendars
    const user_id = sessionStorage.getItem("user_id");
    const new_calendars = [
      {
        newCalendarName: "Personal",
        user_id: user_id,
      },
      {
        newCalendarName: "Availability",
        user_id: user_id,
      },
      {
        newCalendarName: "Invitations",
        user_id: user_id,
      },
    ];

    const createCalendar = async (new_calendar) => {
      const calResponse = await fetch(flaskURL + "/create_calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new_calendar),
        credentials: "include",
      });
      if (!calResponse.ok) {
        alert("Something went wrong, refresh your website!");
        return;
      } else {
        switch (calResponse.status) {
          case 201:
            console.log("Calendar created successfully");
            break;
          case 205:
            alert("Calendar not created!");
            break;
          case 206:
            alert("Missing information!");
            break;
          case 207:
            alert("Calendar not added to user!");
            break;
        }
      }
    };

    const createCalendars = async () => {
      for (const new_calendar of new_calendars) {
        await createCalendar(new_calendar);
      }
    };

    createCalendars();
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Button variant="contained" href="./welcome">
            <CalendarMonthIcon sx={{ marginRight: 1 }} />
            <Typography variant="body1">ScheduSmart</Typography>
          </Button>
          <div>
            <Button color="inherit">Features</Button>
            <Button color="inherit" href="./signin">
              Sign In
            </Button>
            <Button color="secondary">Create Account</Button>
          </div>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Complete your profile by filling in this account creation form
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="userName"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmpassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="confirm-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="./signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
