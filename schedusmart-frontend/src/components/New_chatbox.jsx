import React, { useState } from 'react';
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
    const { friendId } = useParams();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleSendMessage = () => {
        if (inputValue.trim() !== '') {
            setMessages([...messages, { text: inputValue, sender: 'You' }]);
            setInputValue('');
        }
    };

    return (
        <ThemeProvider theme={theme}>
        <Paper style={{ padding: '20px', maxWidth: '400px', margin: 'auto', marginTop: '50px' }}>
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
            </List>
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
        </Paper>
        </ThemeProvider>
    );
};

export default Chatbox;
