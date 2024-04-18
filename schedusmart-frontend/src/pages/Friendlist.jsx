import { useState, useEffect, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CssBaseline from '@mui/material/CssBaseline';
import Checkbox from '@mui/material/Checkbox';
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
import DeleteIcon from '@mui/icons-material/Delete';
import languageLibrary from "../components/language.json";

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
    const [language, setLanguage] = useState(0);
    const fetchInitializeData = async () => {
      let dataOfUser = await send_request("/user_data", {
        "user_id": userId,
      });
      if (dataOfUser.language != undefined) {
        setLanguage(dataOfUser.language);
      }
    };

    const languageData = languageLibrary[language][0].friendList

    const location = useLocation();
    let Color;
    if (location.state == null) {
      Color = localStorage.getItem('system_color');
    }
    else {
      Color = location.state.color_choice;
    }

    const theme = createTheme({
      palette: {
        primary: {
          main: Colors[Color].value.primary,
        },
        secondary: {
          main: Colors[Color].value.secondary,
        },
      },
    });
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
        getRequestList();
        getfriendList();
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
    const [FirstGetRequestList, setFirstGetRequestList] = useState(false);
    const getRequestList = async () => {
        const response = await send_request("/get_friends", { "user_id": userId });
        const request_list = response.request;
        setRequestList(request_list);
    };
    const confirmRequest = async (friend, choice) => {
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
        handleRequestClose();
        getRequestList();
        getfriendList();
    }
    const RedDot = () => (
        <span
            style={{
                position: 'absolute',
                top: 5,
                right: 5,
                backgroundColor: 'red',
                width: 10,
                height: 10,
                borderRadius: '50%',
            }}
        />
    );
    const handlereddot = () => {
        if (requestList.length !== 0) {
            return <RedDot />;
        }
        return null;
    };
    useEffect(() => {
        getRequestList();
        fetchInitializeData();
        setLastMessageHandled(false);
        getfriendList();
    }, []);

    useEffect(() => {
        if (requestopen && !FirstGetRequestList) {
            getRequestList();
            setFirstGetRequestList(true);
        }
        handlereddot();
    }, [requestopen, requestList]);

    // Implementation of friend list 
    const [friendList, setFriendList] = useState([]);
    const getfriendList = async () => {
        const response = await send_request("/get_friends", { "user_id": userId });
        const friend_list = response.friend
        setFriendList(friend_list);
    };
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const handleDeleteButtonClick = () => {
        setDeleteMode(!deleteMode);
    };
    const handleFriendCheckboxChange = (name, checked) => {
        if (checked) {
            setSelectedFriends([...selectedFriends, name]);
        } else {
            setSelectedFriends(selectedFriends.filter((friend) => friend !== name));
        }
    };
    const handleDeleteClick = async () => {
        for (const friend of selectedFriends) {
            const response = await send_request("/delete_friend", { "user_id": userId, "name": friend });
            if (response.error !== undefined) {
                if (response.error === "friend not found" || response.error === "friend not found: 1") {
                    alert("friend not found");
                }
            }
        }
        setSelectedFriends([]);
        setDeleteMode(false);
        getfriendList();
    }

    //Implementation of last messages and avatar
    const [value, setValue] = useState(0);
    let start_point = 0;
    const ref = useRef(null);
    const [lastMessageHandled, setLastMessageHandled] = useState(false);
    const avatar_colors = [
        '#2196f3', // Blue
        '#f44336', // Red
        '#4caf50', // Green
        '#ff9800', // Orange
        '#9c27b0', // Purple
        '#ffeb3b', // Yellow
        '#00bcd4', // Cyan
    ];
    const handleLastMessage = async () => {
        const updatedFriendList = await Promise.all(friendList.map(async (friend) => {
            const fname = friend.name;
            const response = await send_request('/get_messages', { "user_id": userId, "name": fname, "start_point": start_point });
            if (response.data.length > 0) {
                const lastMessageIndex = response.data.length - 1;
                friend.message = response.data[lastMessageIndex].message;
            }
            return friend;
        }));
        setFriendList(updatedFriendList);
    };

    useEffect(() => {
        if (friendList && friendList.length > 0 && !lastMessageHandled) {
            handleLastMessage();
            setLastMessageHandled(true);
        }
    }, [friendList]);

    useEffect(() => {
        ref.current.ownerDocument.body.scrollTop = 0;
    }, [value]);

    return (
        <ThemeProvider theme={theme}>
            <div>{Dashboard(language)}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <h1 style={{ color: theme.palette.primary.main }}>{languageData.friendList}</h1>
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
                    <DialogTitle>{languageData.addFriend}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {languageData.instruction}
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
                                    label={languageData.userName}
                                    name="username"
                                    variant="standard" />
                            )} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleInvitationSubmit}>{languageData.sendInvitation}</Button>
                        <Button onClick={handleInvitationClose}>{languageData.cancel}</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={confirmationOpen} onClose={handleConfirmationClose}>
                    <DialogTitle>{languageData.confirmation}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{languageData.notification}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmationClose}>{languageData.sure}</Button>
                    </DialogActions>
                </Dialog>
                <Fab
                    aria-label="friend request"
                    color="primary"
                    size="small">
                    <MessageIcon onClick={handleRequestClickOpen} />
                    {handlereddot()}
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
                    <DialogTitle>{languageData.friendRequest}</DialogTitle>
                    <DialogContent>
                        <List sx={{ width: 500 }}>
                            {requestList.length > 0 ? (requestList.map(({ name, confirm, chatroom }, index) => (
                                <ListItem key={name + index}>
                                    <ListItemText primary={`${name}`+ languageData.wantToAdd} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="accept" sx={{ color: 'green' }} onClick={() => confirmRequest(name, true)}>
                                            <CheckIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="reject" sx={{ color: 'red', marginLeft: 3 }} onClick={() => confirmRequest(name, false)}>
                                            <CloseIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))) : <Typography variant="body1">{languageData.noRequestsFound}</Typography>}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleRequestClose}>{languageData.back}</Button>
                    </DialogActions>
                </Dialog>
                <Fab
                    aria-label="friend request"
                    color="primary"
                    size="small">
                    <DeleteIcon onClick={handleDeleteButtonClick} />
                </Fab>
                {deleteMode && <Button variant="contained" onClick={handleDeleteClick}>{languageData.delete}</Button>}
            </div>
            <Box sx={{ pb: 7 }} ref={ref}>
                <CssBaseline />
                <List sx={{ width: "70%" }}>
                    {friendList.length > 0 ? friendList.map(({ name, confirm, message, avatar_color }, id) => (
                        <ListItemButton key={id + name}>
                            {deleteMode && (
                                <ListItemIcon>
                                    <Checkbox
                                        onChange={(e) => handleFriendCheckboxChange(name, e.target.checked)}
                                        checked={selectedFriends.includes(name)}
                                    />
                                </ListItemIcon>
                            )}
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: avatar_color }}>{name[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={name} secondary={message} />
                            <ListItemSecondaryAction>
                                <Button component={Link} to={`/friendlist/${name}/${id}`}>{languageData.enterChatbox}</Button>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                    )) : <Typography variant="body1">{languageData.noFriendsFound}</Typography>}
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


