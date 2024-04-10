import React, { useState,useRef,useEffect} from 'react';
import { TextField, Button, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { orange, grey } from "@mui/material/colors";
const theme = createTheme({
    palette: {
        primary: orange,
        secondary: {
            main: "#ab5600",
        },
    },
});

const Chatbox = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleSendMessage = () => {
        if (inputValue.trim() !== '') {
            setMessages([...messages, { text: inputValue, sender: 'You' }]);
            setInputValue('');
        }
    };
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <ThemeProvider theme={theme}>
            <div style={{ minHeight: 'calc(100vh - 100px)', position: 'relative',top:'30px' }}>
            <Paper style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                <List>
                    {messages.map((message, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={message.sender}
                                secondary={message.text}
                                primaryTypographyProps={{ color: 'primary' }}
                                secondaryTypographyProps={{ color: 'textPrimary' }}
                            />
                        </ListItem>
                    ))}
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
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    style={{ marginTop: '10px', alignSelf: 'flex-end' }}
                >
                    Send
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    href="/friendlist"
                    style={{ marginTop: '10px', alignSelf: 'flex-end',marginLeft:'20px' }}
                >
                    Back
                </Button>
            </div>
            </div>
        </ThemeProvider>
    );
};

export default Chatbox;
