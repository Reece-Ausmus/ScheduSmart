import { useState, useEffect, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from "./Dashboard";
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Fab from "@mui/material/Fab";
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { orange, grey } from "@mui/material/colors";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import send_request from "./requester";
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

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
    return messageExamples;
}
const messageExamples = [
    {
        primary: 'Brunch this week?',
        secondary: "I'll be in the neighbourhood this week. Let's grab a bite to eat",
        person: '/static/images/avatar/5.jpg',
    },
];
const friends = [
    { id: 1, name: 'Friend 1' },
    { id: 2, name: 'Friend 2' },
    { id: 3, name: 'Friend 3' },
  ];

// function getNameList(){
//     const [friends, setFriends] = useState();
//     const NameList = async () => {
//         const response = await send_request("/get_friends", { "user_id": userId });
//         const request_list=response.request;
//         console.log(request_list.chatroom);
//         const updatedFriends = request_list.map((friend, index) => ({
//             id: friend.id,
//             name: friend.name
//         }));
//         setFriends(updatedFriends);
//     };
// }


const Link = RouterLink;
function ListItemLink(props) {
    const { icon, primary, to } = props;
    return (
        <li>
            <ListItem button component={Link} to={to}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}
ListItemLink.propTypes = {
    icon: PropTypes.element,
    primary: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
};

export default function Friendlist() {
    const [value, setValue] = useState(0);
    const ref = useRef(null);
    const [messages, setMessages] = useState(() => refreshMessages());
    const [open, setOpen] = useState(false);
    const [Props, setProps] = useState({ options: [] });
    const handleSearchUser = async (event, name) => {
        if (!name) {
            setProps({ options: [] });
            return;
        }
        const response = await send_request("/search_user", { "name": name });
        const name_list = response.data;
        setProps({ options: name_list });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {
        console.log("submit");
        const username = document.getElementById("username").value;
        const regex = /[\\"\s\'\\\x00-\x1F\x7F]/g;
        if (!username.localeCompare("")) {
            alert("Please fill up your friend's username!");
            return;
        }
        else if (regex.test(username)) {
            alert("Input contains special characters. Please remove them and try again!");
            return;
        }
        const response = await send_request("/request_friend", { "user_id": userId, "name": username });
        if (response.error != undefined) {
            if (response.error == "user requesting himself as friend") {
                alert("You are unable to request yourself as friend.");
            }
            if (response.error == "request already send") {
                alert("The request has already been sent.");
            }
            if (response.error == "already receive request from friend") {
                alert("The request has already been received from your friend");
            }
            if (response.error == "friend not found") {
                alert("Friend can not been found.")
            }
        }
    };

    useEffect(() => {
        ref.current.ownerDocument.body.scrollTop = 0;
        setMessages(refreshMessages());
    }, [value, setMessages]);

    return (
        <ThemeProvider theme={theme}>
            <div>{Dashboard()}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <h1>Friend list</h1>
                <Fab
                    aria-label="add"
                    color="primary"
                    size="small">
                    <AddIcon onClick={handleClickOpen} />
                </Fab>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                    }}>
                    <DialogTitle>Add friend</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To add your friend in your list, please provide your friend's user name here. We
                            will send an invitation after you click the "send inviation" button.
                        </DialogContentText>
                        <Autocomplete
                            {...Props}
                            id="username"
                            onInputChange={handleSearchUser}
                            renderInput={(params) => (
                                <TextField {...params}
                                    autoFocus
                                    required
                                    margin="dense"
                                    label="User name"
                                    name="username"
                                    variant="standard" />
                            )} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSubmit}>Send invitation</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Box sx={{ pb: 7 }} ref={ref}>
                <CssBaseline />
                <List>
                    {friends.map((friend) => (
                        <ListItemLink key={friend.id} to={`/chat/${friend.id}`} primary={friend.name} />
                    ))}
                </List>
                {/* <List>
                    {messages.map(({ primary, secondary, person }, index) => (
                        <ListItemButton key={index + person}>
                            <ListItemAvatar>
                                <Avatar alt="Profile Picture" src={person} />
                            </ListItemAvatar>
                            <ListItemText primary={primary} secondary={secondary} />
                        </ListItemButton>
                    ))}
                </List> */}
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


