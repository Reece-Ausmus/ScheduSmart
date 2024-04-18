import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Backdrop, CircularProgress } from '@mui/material';


const Browser_reminder = () => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog open={open}>
                <DialogTitle>Persistent Popup Title</DialogTitle>
                <DialogContent>
                    <p>This is the content of the persistent popup.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Browser_reminder;