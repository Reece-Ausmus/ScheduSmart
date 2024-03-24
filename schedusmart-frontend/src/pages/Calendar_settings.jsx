import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from "@mui/material/colors";

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

export default function Calendar_Settings() {
    const [showVirtual, setShowVirsual] = useState(() => { return parseInt(localStorage.getItem('showVirtual')) || 0; });
    useEffect(() => {
        localStorage.setItem('showVirtual', showVirtual.toString());
    }, [showVirtual]);

    const handleVirtualSelectChange = (e) => {
        setShowVirsual(parseInt(e.target.value));
        updateFormat(parseInt(e.target.value));
    };
    async function updateFormat(calendar_mode) {
        if (userId === "undefined") {
          alert("userId disappear, so it will eventually fail");
          return;
        }
        const info = {
          mode: calendar_mode,
          user_id: userId,
        };
        const response = await fetch(flaskURL + "/update_calendar_format", {
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
              console.log("Change calendar format successfully");
              break;
            case 205:
              alert("Failed to change the calendar mode");
              break;
            default:
              alert("Unexpected response status: " + response.status);
          }
        }
      }

    return (
        <ThemeProvider theme={theme}>
            <Card>
                <CardHeader subheader="Update calendar settings" title="Calendar" />
                <Divider />
                <CardContent>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Typography variant="subtitle1" gutterBottom style={{ marginRight: '10px' }}>
                            Calendar visualization format:
                        </Typography>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="visual_format">Visual format</InputLabel>
                            <Select
                                labelId="format"
                                id="visual_format"
                                value={showVirtual}
                                label="visual_format"
                                onChange={handleVirtualSelectChange}
                                style={{ minWidth: '120px' }}
                            >
                                <MenuItem value={1}>day</MenuItem>
                                <MenuItem value={2}>week</MenuItem>
                                <MenuItem value={3}>month</MenuItem>
                                <MenuItem value={4}>year</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </CardContent>
            </Card>

        </ThemeProvider >
    );
}