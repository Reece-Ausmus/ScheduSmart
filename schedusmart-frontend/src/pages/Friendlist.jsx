import { useState, useEffect, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CssBaseline from '@mui/material/CssBaseline';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Dashboard from "./Dashboard";
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Fab from "@mui/material/Fab";
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';
import { List, ListItemSecondaryAction } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { orange } from "@mui/material/colors";
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
import MessageIcon from '@mui/icons-material/Message';
import IconButton from '@mui/material/IconButton';

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

// Get messages
const messageExamples = [
    {
        name: 'Stanley',
        message1: "I'll be in the neighbourhood this week. Let's grab a bite to eat",
        person: '/static/images/avatar/5.jpg',
        id: 1,
    },
    {
        name: 'Cassie',
        message1: "I'll be in the neighbourhood this week. Let's grab a bite to eat",
        person: '/static/images/avatar/5.jpg',
        id: 2,
    },
];
function refreshMessages() {
    return messageExamples;
}

// const messages = async()=> {
//     const response = await send_request("/get_messages", { "user_id": userId, "name":friend,"start_point":0});

// }

// Get friend list
const nameList = [
    { id: 1, name: 'Friend 1' },
    { id: 2, name: 'Friend 2' },
    { id: 3, name: 'Friend 3' },
];


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
    // Implementation of invitations
    const [value, setValue] = useState(0);
    const ref = useRef(null);
    const [messages, setMessages] = useState(() => refreshMessages());
    const [invitationopen, setInvitationOpen] = useState(false);
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

    const handleInvitationClickOpen = () => {
        setInvitationOpen(true);
    };
    const handleInvitationClose = () => {
        setInvitationOpen(false);
    };
    const handleInvitationSubmit = async () => {
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

    // Implementation of request list
    const [requestopen, setRequestOpen] = useState(false);
    const handleRequestClickOpen = () => {
        setRequestOpen(true);
    };
    const handleRequestClose = () => {
        setRequestOpen(false);
    };

    const [requestList, setRequestList] = useState(null);
    const getRequestList = async () => {
        const response = await send_request("/get_friends", { "user_id": userId });
        const request_list = response.request;
        setRequestList(request_list);
    };
    useEffect(() => {
        if (requestopen) {
            getRequestList();
        }
    }, [requestopen]);

    const confirmRequest = async (friend,choice) => {
        console.log(choice);
        const response = await send_request("/confirm_friend", { "user_id": userId,"name":friend,"confirm":choice});
    }

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
                    <AddIcon onClick={handleInvitationClickOpen} />
                </Fab>
                <Dialog
                    open={invitationopen}
                    onClose={handleInvitationClose}
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
                        <Button onClick={handleInvitationSubmit}>Send invitation</Button>
                        <Button onClick={handleInvitationClose}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                <Fab
                    aria-label="friend request"
                    color="primary"
                    size="small">
                    <MessageIcon onClick={handleRequestClickOpen} />
                </Fab>
                <Dialog
                    open={requestopen}
                    onClose={handleRequestClose}
                    PaperProps={{
                        component: 'form',
                        sx: {
                            width: 'auto',
                            maxWidth: 'sm',
                        }
                    }}>
                    <DialogTitle>Friend request</DialogTitle>
                    <DialogContent>
                        <List sx={{ width: 500 }}>
                            {requestList && requestList.map(({ name, confirm, chatroom }, index) => (
                                <ListItem key={name+index}>
                                    <ListItemText primary={`${name} wants to add you as a friend`} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="accept" sx={{ color: 'green' }} onClick={() => confirmRequest(name, true)}>
                                            <CheckIcon/>
                                        </IconButton>
                                        <IconButton edge="end" aria-label="reject" sx={{ color: 'red', marginLeft: 3 }} onClick={() => confirmRequest(name, false)}>
                                            <CloseIcon/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleRequestClose}>Back</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Box sx={{ pb: 7 }} ref={ref}>
                <CssBaseline />
                <List>
                    {messages.map(({ name, message1, person, id }, index) => (
                        <ListItemButton key={index + person} component={Link} to={`/chat/${id}`}>
                            <ListItemAvatar>
                                <Avatar alt="Profile Picture" src={person} />
                            </ListItemAvatar>
                            <ListItemText primary={name} secondary={message1} />
                        </ListItemButton>))}
                </List>
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                    <BottomNavigation
                        showLabels
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}>
                        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
                        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
                        <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
                    </BottomNavigation>
                </Paper>
            </Box>
        </ThemeProvider>
    );
}


