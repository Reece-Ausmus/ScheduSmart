import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { orange, grey } from "@mui/material/colors";
import send_request from "../pages/requester";

const userId = sessionStorage.getItem("user_id");
const theme = createTheme({
    palette: {
        primary: orange,
        secondary: {
            main: "#ab5600",
        },
    },
});

const Chatbox = () => {
    const { fname, id } = useParams();
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    // handle get messages
    let start_point = 0;
    const getMessages = async () => {
        const response = await send_request("/get_messages", { "user_id": userId, "name": fname, "start_point": start_point });
        const message_history = response.data;
        console.log(message_history);
        setMessages(message_history);
    }
    // handle send messgaes
    const handleSendMessage = async () => {
        if (inputValue.trim() !== '') {
            setMessages([...messages, { message: inputValue, type: 1 }]);
            console.log("send messages", messages);
            setInputValue('');
            const response = await send_request('/send_message', { "user_id": userId, "name": fname, "message": inputValue });
            console.log(response);
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
        console.log("get messages", messages);
        return messages.map((message, index) => (
            <ListItem key={index} className={message.type === 1 ? "left-message" : "right-message"}>
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
