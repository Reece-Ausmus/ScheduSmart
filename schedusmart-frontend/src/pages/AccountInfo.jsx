// This documentation is used for building create-account UI page

import { useState, useEffect } from "react";
import "./AccountInfo.css";
import languageData from "../components/language.json";
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
import { orange } from "@mui/material/colors";
import Input from '@mui/material/Input';

//this can be change when flask's ip become static
//currently it's localhost

const flaskURL = "http://127.0.0.1:5000";
const userId = sessionStorage.getItem("user_id"); //"Sup3XDcQrNUm6CGdIJ3W5FHyPpQ2";

const theme = createTheme({
  palette: {
    primary: orange,
    secondary: {
      main: "#ab5600",
    },
  },
});

export default function AccountInfo(language) {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("West Lafayette");

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
          console.log(userId);
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
          <CardHeader subheader="Update account information" title="Profile" />
          <Divider />
          <CardContent>
            <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
              <div style={{ display: 'flex' }}>
                <FormControl style={{ marginRight: '20px' }}>
                  <InputLabel htmlFor="component-outlined">{languageData[language][0][0].firstName}</InputLabel>
                  <OutlinedInput id="firstname" value={firstname} label="firstName" onChange={(e) => setFirstName(e.target.value)}/>
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="component-outlined">{languageData[language][0][0].lastName}</InputLabel>
                  <OutlinedInput id="lastname" value={lastname} label="lastName" onChange={(e) => setLastName(e.target.value)}/>
                </FormControl>
              </div>
              <FormControl>
                <InputLabel htmlFor="component-outlined">{languageData[language][0][0].userName}</InputLabel>
                <OutlinedInput id="username" value={username} label="userName" onChange={(e) => setUsername(e.target.value)}/>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="component-outlined">{languageData[language][0][0].email}</InputLabel>
                <OutlinedInput id="email" value={email} label="email" onChange={(e) => setEmail(e.target.value)}/>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="component-outlined">{languageData[language][0][0].location}</InputLabel>
                <OutlinedInput id="location" value={location} label="location"onChange={(e) => setLocation(e.target.value)} />
              </FormControl>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button  variant="contained" onClick={handleInfo}>{languageData[language][0][0].restToDefault}</Button>
            <Button  variant="contained" onClick={updateInfo}>{languageData[language][0][0].Updateaccount}</Button>
          </CardActions>
        </Card>
    </ThemeProvider>
  );
}
