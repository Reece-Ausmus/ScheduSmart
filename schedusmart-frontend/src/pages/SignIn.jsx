import { useState } from 'react';
import './SignIn.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, IconButton, Menu, Toolbar } from '@mui/material';
import { orange } from '@mui/material/colors';

// To install the dependencies, run the following command in the terminal:
// npm install @mui/material @emotion/react
// npm install @material-ui/core@next 
// npm install @mui/icons-material
// npm install @material-ui/icons

const flaskURL = "http://127.0.0.1:5000";

const theme = createTheme({
  palette: {
    primary: orange,
    secondary: {
      main: '#ab5600',
    },
  },
});
  
export default function SignIn() {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate if email and password are not empty
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    const response = await fetch(flaskURL + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
      credentials: "include"
    });
    if (!response.ok) {
      alert("something went wrong, refresh your website");
    } else {
      switch(response.status) {
        case 201:
          console.log("sign-in account successfull");
          const responseData = await response.json();
          const userId = responseData.user_id;
          sessionStorage.setItem('user_id', userId);
          window.location.href = '/calendar'
          window.location.href = '/calendar';     
          break;
        case 205:
          alert("Invalid email or password.");
          break;
        case 206:
          alert("To login, please click on the verification link in the email we sent you!");
          break;
      }
    }
  };
  
    return (
      <ThemeProvider theme={theme}>
        <AppBar position="static" color = "primary">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Button variant="contained" href="./welcome">
              <CalendarMonthIcon sx={{ marginRight: 1 }}/>
              <Typography variant="body1" >
                ScheduSmart
              </Typography>
            </Button>
            <div>
              <Button color="inherit">
                Features
              </Button>
              <Button color="secondary">
                Sign In
              </Button>
              <Button color="inherit" href="./createaccount">
                Create Account
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" > 
              Sign in
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Enter your email and password
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: 'warning.main' }}
              >
                Login
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="./createaccount" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }