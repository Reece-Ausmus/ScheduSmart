// This documentation is used for building create-account UI page

import { useState, useEffect } from "react";
import languageLibrary from "../components/language.json";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red, orange, yellow, green, blue, purple, pink } from "@mui/material/colors";

import Input from '@mui/material/Input';
import {useLocation} from 'react-router-dom';

//this can be change when flask's ip become static
//currently it's localhost

const flaskURL = "http://127.0.0.1:5000";
const userId = sessionStorage.getItem("user_id"); //"Sup3XDcQrNUm6CGdIJ3W5FHyPpQ2";
const Colors = [
  { id: 0, value: {primary:red[500],secondary:red[400]}, label: "Red" },
  { id: 1, value: {primary:orange[300],secondary:orange[200]}, label: "Orange" },
  { id: 2, value: {primary:yellow[300],secondary:yellow[200]}, label: "Yellow" },
  { id: 3, value: {primary:green[200],secondary:green[100]}, label: "Green" },
  { id: 4, value: {primary:blue[200],secondary:blue[100]}, label: "Blue" },
  { id: 5, value: {primary:purple[200],secondary:purple[100]}, label: "Purple" },
  { id: 6, value: {primary:pink[200],secondary:pink[100]}, label: "Pink" },
];
const theme = createTheme({
  palette: {
    primary: orange,
    secondary: {
      main: "#ab5600",
    },
  },
});

export default function AccountInfo(language) {
//   const data = useLocation();
//   let Color;
//   if (data.state == null){
//     Color =localStorage.getItem('systemcolor');
//   }
//   else{
//     Color =data.state.color_choice;
//   }

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: Colors[Color].value.primary,
//     },
//     secondary: {
//       main: Colors[Color].value.secondary,
//     },
//   },
// });

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("West Lafayette");

  const languageData = languageLibrary[language][0].AccountInfo;

  const handleInfo = async (event) => {
    const response = await fetch(flaskURL + "/user_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
      }),
      credentials: "include",
    });
    if (!response.ok) {
      alert("Account Info Not Found. Please log-out and log-in again");
    } else {
      switch (response.status) {
        case 201:
          const responseData = await response.json();
          const userId = responseData.user_id;
          setFirstName(responseData.first_name);
          setLastName(responseData.last_name);
          setUsername(responseData.user_name);
          setEmail(responseData.email);
          if (responseData.location != null) setLocation(responseData.location);
          break;
        case 202:
          alert("User Not Found");
          break;
        case 205:
          alert("Failing to retrieve user data");
          break;
      }
    }
  };

  useEffect(() => {
    handleInfo();
  }, []);

  const updateInfo = async (event) =>{
    event.preventDefault();

    const regex = /[\\"\s\'\\\x00-\x1F\x7F]/g;
    if (!lastname.localeCompare("") || !firstname.localeCompare("")) {
      alert("Please fill up your name!");
    } else if (!username.localeCompare("")) {
      alert("Please fill up your username!");
    } else if (!email.localeCompare("")) {
      alert("Please fill up your email!");
    } else if (
      regex.test(firstname) ||
      regex.test(lastname) ||
      regex.test(username)
    ) {
      alert(
        "Input contains special characters. Please remove them and try again!"
      );
    } else {
      const info = {
        first_name: firstname,
        last_name: lastname,
        user_name: username,
        email: email,
        user_id: userId,
        location: location,
      };
      const response = await fetch(flaskURL + "/update_account_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(info),
      });
      if (!response.ok) {
        alert("something went wrong, refresh your website");
      } else {
        switch (response.status) {
          case 201:
            console.log("Updated account info!");
            alert("Updated Account Info!")
            break;
          case 205:
            console.log("Failed to update account");
            alert("Failed to update account! Check New Information!");
            break;
          case 206:
            console.log("Missing info");
            alert("Failed to update account!");
            break;
        }
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
        <Card>
          <CardHeader subheader={languageData.updateAccountInformation} title={languageData.Profile} />
          <Divider />
          <CardContent>
            <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
              <div style={{ display: 'flex' }}>
                <FormControl style={{ marginRight: '20px' }}>
                  <InputLabel htmlFor="component-outlined">{}</InputLabel>
                  <OutlinedInput id="firstname" value={firstname} label="firstName" onChange={(e) => setFirstName(e.target.value)}/>
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="component-outlined">{}</InputLabel>
                  <OutlinedInput id="lastname" value={lastname} label="lastNamer" onChange={(e) => setLastName(e.target.value)}/>
                </FormControl>
              </div>
              <FormControl>
                <InputLabel htmlFor="component-outlined">{}</InputLabel>
                <OutlinedInput id="username" value={username} label="userName" onChange={(e) => setUsername(e.target.value)}/>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="component-outlined">{}</InputLabel>
                <OutlinedInput id="email" value={email} label="email" onChange={(e) => setEmail(e.target.value)}/>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="component-outlined">{}</InputLabel>
                <OutlinedInput id="location" value={location} label="location"onChange={(e) => setLocation(e.target.value)} />
              </FormControl>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button  variant="contained" onClick={handleInfo}>{languageData.reset}</Button>
            <Button  variant="contained" onClick={updateInfo}>{languageData.update}</Button>
          </CardActions>
        </Card>
    </ThemeProvider>
  );
}
