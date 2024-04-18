import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import send_request from "../pages/requester";
import { useLocation } from 'react-router-dom';
import { red, orange, yellow, green, blue, purple, pink } from "@mui/material/colors";

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
  
const Chatbox = () => {
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
    const { fname, id } = useParams();
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    // handle get messages
    let start_point = 0;
    const getMessages = async () => {
        const response = await send_request("/get_messages", { "user_id": userId, "name": fname, "start_point": start_point });
        const message_history = response.data;
        setMessages(message_history);
    }
    // handle send messgaes
    const handleSendMessage = async () => {
        if (inputValue.trim() !== '') {
            setMessages([...messages, { message: inputValue, type: 1 }]);
            setInputValue('');
            const response = await send_request('/send_message', { "user_id": userId, "name": fname, "message": inputValue });
            if (response.error != undefined) {
                if (response.error == "friend not found") {
                    alert("friend not found");
                }
                if (response.error == "fatal") {
                    alert("type error or key error.");
                }
            }
        }
    };
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        getMessages();
        renderMessages(messages);
    }, [])

    const renderMessages = (messages) => {
        return messages.map((message, index) => (
            <ListItem key={index} style={{ textAlign: message.type === 1 ? "left" : "right" }}>
                <ListItemText
                    primary={message.type === 1 ? "You" : fname}
                    secondary={message.message}
                    primaryTypographyProps={{ color: 'primary' }}
                    secondaryTypographyProps={{ color: 'textPrimary' }}
                />
            </ListItem>
        ));
    };

    return (
        <ThemeProvider theme={theme}>
            <div style={{ minHeight: 'calc(100vh - 100px)', position: 'relative', top: '30px' }}>
                <Paper style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                    <List>
                        {renderMessages(messages)}
                        <div ref={messagesEndRef} />
                    </List>
                </Paper>
                <div style={{ position: 'absolute', bottom: -30, left: 0, right: 0 }}>
                    <TextField
                        label="Type a message"
                        variant="outlined"
                        fullWidth
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendMessage}
                        style={{ marginTop: '10px', alignSelf: 'flex-end' }}>
                        Send
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        href="/friendlist"
                        style={{ marginTop: '10px', alignSelf: 'flex-end', marginLeft: '20px' }}>
                        Back
                    </Button>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Chatbox;
