import { useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { orange, grey } from "@mui/material/colors";
import Dashboard from "./Dashboard";

// Define the Flask API URL
const flaskURL = "http://127.0.0.1:5000";

// user_id to get user info
const userId = sessionStorage.getItem("user_id");

const theme = createTheme({
    palette: {
        primary: orange,
        secondary: {
            main: "#ab5600",
        },
    },
});

function refreshMessages() {
    // const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

    // return Array.from(new Array(messageExamples.length)).map(
    //     () => messageExamples[getRandomInt(messageExamples.length)],
    // );
    return messageExamples;
}

export default function Friendlist() {
    const [value, setValue] = useState(0);
    const ref = useRef(null);
    const [messages, setMessages] = useState(() => refreshMessages());

    useEffect(() => {
        ref.current.ownerDocument.body.scrollTop = 0;
        setMessages(refreshMessages());
    }, [value, setMessages]);

    return (
        <ThemeProvider theme={theme}>
            <div>{Dashboard()}</div>
            <h1>Friend list</h1>
            <Box sx={{ pb: 7 }} ref={ref}>
                <CssBaseline />
                <List>
                    {messages.map(({ primary, secondary, person }, index) => (
                        <ListItemButton key={index + person}>
                            <ListItemAvatar>
                                <Avatar alt="Profile Picture" src={person} />
                            </ListItemAvatar>
                            <ListItemText primary={primary} secondary={secondary} />
                        </ListItemButton>
                    ))}
                </List>
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                    <BottomNavigation
                        showLabels
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                    >
                        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
                        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
                        <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
                    </BottomNavigation>
                </Paper>
            </Box>
        </ThemeProvider>
    );
}

const messageExamples = [
    {
        primary: 'Brunch this week?',
        secondary: "I'll be in the neighbourhood this week. Let's grab a bite to eat",
        person: '/static/images/avatar/5.jpg',
    },
    {
        primary: 'Birthday Gift',
        secondary: `Do you have a suggestion for a good present for John on his work
      anniversary. I am really confused & would love your thoughts on it.`,
        person: '/static/images/avatar/1.jpg',
    },
    {
        primary: 'Recipe to try',
        secondary: 'I am try out this new BBQ recipe, I think this might be amazing',
        person: '/static/images/avatar/2.jpg',
    },
    {
        primary: 'Yes!',
        secondary: 'I have the tickets to the ReactConf for this year.',
        person: '/static/images/avatar/3.jpg',
    },
    {
        primary: "Doctor's Appointment",
        secondary: 'My appointment for the doctor was rescheduled for next Saturday.',
        person: '/static/images/avatar/4.jpg',
    },
    {
        primary: 'Discussion',
        secondary: `Menus that are generated by the bottom app bar (such as a bottom
      navigation drawer or overflow menu) open as bottom sheets at a higher elevation
      than the bar.`,
        person: '/static/images/avatar/5.jpg',
    },
    {
        primary: 'Summer BBQ',
        secondary: `Who wants to have a cookout this weekend? I just got some furniture
      for my backyard and would love to fire up the grill.`,
        person: '/static/images/avatar/1.jpg',
    },
];
