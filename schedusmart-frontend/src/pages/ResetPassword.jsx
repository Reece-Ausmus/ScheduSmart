import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar, Toolbar } from "@mui/material";
import { orange } from "@mui/material/colors";

// To install the dependencies, run the following command in the terminal:
// npm install --force inside of the frontend directory.

const flaskURL = "http://127.0.0.1:5000";

const theme = createTheme({
  palette: {
    primary: orange,
    secondary: {
      main: "#ab5600",
    },
  },
});

export default function ResetPassword() {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;

    // Validate if email is not empty
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    const response = await fetch(flaskURL + "/reset_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (!response.ok) {
      alert("Something went wrong. Please try again later.");
    } else {
      alert("Password reset email sent successfully.");
    }
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Enter your email address to reset your password.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "warning.main" }}
            >
              Reset Password
            </Button>
            <Grid container>
              <Grid item>
                <Link href="./signin" variant="body2">
                  Back to Sign In
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
