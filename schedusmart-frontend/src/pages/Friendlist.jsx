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
import Typography from "@mui/material/Typography";
import Chatbox from "../components/New_chatbox"
import { red, orange, yellow, green, blue, purple, pink } from "@mui/material/colors";
import { useLocation } from 'react-router-dom';

// user_id to get user info
const userId = sessionStorage.getItem("user_id");
const Colors = [
    { id: 0, value: { primary: red[500], secondary: red[400] }, label: "Red" },
    { id: 1, value: { primary: orange[300], secondary: orange[200] }, label: "Orange" },
    { id: 2, value: { primary: yellow[300], secondary: yellow[200] }, label: "Yellow" },
    { id: 3, value: { primary: green[200], secondary: green[100] }, label: "Green" },
    { id: 4, value: { primary: blue[200], secondary: blue[100] }, label: "Blue" },
    { id: 5, value: { primary: purple[200], secondary: purple[100] }, label: "Purple" },
    { id: 6, value: { primary: pink[200], secondary: pink[100] }, label: "Pink" },
];
const theme = createTheme({
    palette: {
        primary: orange,
        secondary: {
            main: "#ab5600",
        },
    },
});

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
    // const location = useLocation();
    // let Color;
    // if (location.state == null) {
    //   Color = localStorage.getItem('systemcolor');
    // }
    // else {
    //   Color = location.state.color_choice;
    // }

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
    // Implementation of invitations
    const [invitationopen, setInvitationOpen] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
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
    const handleConfirmationClose = () => {
        setConfirmationOpen(false);
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
                return;
            }
            if (response.error == "request already send") {
                alert("The request has already been sent.");
                return;
            }
            if (response.error == "already receive request from friend") {
                alert("The request has already been received from your friend");
                return;
            }
            if (response.error == "friend not found") {
                alert("Friend can not been found.")
                return;
            }
        }
        setConfirmationOpen(true);
    };

    // Implementation of request list 
    const [requestopen, setRequestOpen] = useState(false);
    const handleRequestClickOpen = () => {
        setRequestOpen(true);
    };
    const handleRequestClose = () => {
        setRequestOpen(false);
    };
    const [requestList, setRequestList] = useState([]);

    const getRequestList = async () => {
        const response = await send_request("/get_friends", { "user_id": userId });
        const request_list = response.request;
        setRequestList(request_list);
    };
    useEffect(() => {
        if (requestopen) {
            getRequestList();
        }
    }, [requestopen, requestList]);

    const confirmRequest = async (friend, choice) => {
        console.log(choice);
        const response = await send_request("/confirm_friend", { "user_id": userId, "name": friend, "confirm": choice });
        if (response.error != undefined) {
            if (response.error == "request not found") {
                alert("request not found");
            }
            if (response.error == "account not found, please send the friend request again") {
                alert("account not found, please send the friend request again");
            }
            if (response.error == "admit request not found") {
                alert("admit request not found");
            }
        }
    }

    // Implementation of friend list 
    const [friendList, setFriendList] = useState([]);
    const getfriendList = async () => {
        const response = await send_request("/get_friends", { "user_id": userId });
        const friend_list = response.friend
        setFriendList(friend_list);
    };

    //Implementation of messages
    const [value, setValue] = useState(0);
    let start_point=0;
    const ref = useRef(null);
    const [messages, setMessages] = useState();
    const handleFirstMessage = async () => {
        const updatedFriendList = await Promise.all(friendList.map(async (friend) => {
            const fname = friend.name;
            const response = await send_request('/get_messages', {"user_id": userId, "name": fname, "start_point": start_point});
            friend.message = response.data[0].message;
            return friend;
        }));
        setFriendList(updatedFriendList);
    };
    useEffect(() => {
        ref.current.ownerDocument.body.scrollTop = 0;
    }, [value, setMessages,friendList]);

    useEffect(() => {
        getfriendList();
    }, []);
    
    useEffect(() => {
        if (friendList && friendList.length > 0) {
            handleFirstMessage();
        }
    }, [friendList]);

    return (
        <ThemeProvider theme={theme}>
            <div>{Dashboard()}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <h1 style={{ color: theme.palette.primary.main }}>Friend list</h1>
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
                <Dialog open={confirmationOpen} onClose={handleConfirmationClose}>
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Your friend request has been sent.</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmationClose}>Sure</Button>
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
                            {requestList.length > 0 ? (requestList.map(({ name, confirm, chatroom }, index) => (
                                <ListItem key={name + index}>

                                    <ListItemText primary={`${name} wants to add you as a friend`} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="accept" sx={{ color: 'green' }} onClick={() => confirmRequest(name, true)}>
                                            <CheckIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="reject" sx={{ color: 'red', marginLeft: 3 }} onClick={() => confirmRequest(name, false)}>
                                            <CloseIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))) : <Typography variant="body1">No requests found.</Typography>}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleRequestClose}>Back</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Box sx={{ pb: 7 }} ref={ref}>
                <CssBaseline />
                <List sx={{ width: "40%" }}>
                    {friendList.length > 0 ? friendList.map(({ name, confirm, message}, id) => (
                        <ListItemButton key={id + name} component={Link} to={`/friendlist/${name}/${id}`}>
                            <ListItemAvatar>
                                <Avatar alt="Profile Picture" src={name} />
                            </ListItemAvatar>
                            <ListItemText primary={name} secondary={message} />
                        </ListItemButton>)) : <Typography variant="body1">No friends found.</Typography>}
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


