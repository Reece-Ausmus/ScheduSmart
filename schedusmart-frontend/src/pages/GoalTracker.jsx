import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { orange } from "@mui/material/colors";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const theme = createTheme({
    palette: {
        primary: {
            main: orange[500],
        },
        secondary: {
            main: "#ab5600",
        },
    },
    components: {
        MuiDataGrid: {
          styleOverrides: {
            root: {
              backgroundColor: "gray",
            },
          },
        },
      },
});

const columns = [
    { field: "eventName", headerName: "Event Name", width: 200 },
    { field: "caloriesBurned", headerName: "Calories Burned", width: 200 },
];

function GoalTracker({ habits }) {
    const [exerciseEvents, setExerciseEvents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [eventName, setEventName] = useState("");
    const [caloriesBurned, setCaloriesBurned] = useState(0); // Burned calories, taken from Exercise Tracker table
    const [dailyGoal, setDailyGoal] = useState(2000); // daily goal, set by user in future
    const [caloriesConsumed, setCaloriesConsumed] = useState(0); // Consumed calories, taken from Habits.jsx table
    const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0); // Total calories burned

    useEffect(() => {
        // Update totalCaloriesBurned whenever exerciseEvents change
        const totalBurned = exerciseEvents.reduce((total, event) => total + event.caloriesBurned, 0);
        setTotalCaloriesBurned(totalBurned);
    }, [exerciseEvents]);

    useEffect(() => {
        // Update caloriesConsumed whenever habits change
        if (habits) {
            const totalCaloriesConsumed = habits.reduce(
                (accumulator, habit) => accumulator + parseFloat(habit.calories),
                0,
            );
            setCaloriesConsumed(totalCaloriesConsumed);
        }
    }, [habits]);

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const addExerciseEvent = () => {
        if (eventName.trim() !== "" && caloriesBurned.trim() !== "") {
            const newEvent = {
                eventName: eventName.trim(),
                id: exerciseEvents.length + 1,
                caloriesBurned: parseFloat(caloriesBurned),
            };
    
            setExerciseEvents([...exerciseEvents, newEvent]);
    
            // Update totalCaloriesBurned
            const newTotalCaloriesBurned = totalCaloriesBurned + parseFloat(caloriesBurned);
            setTotalCaloriesBurned(newTotalCaloriesBurned);
    
            setEventName("");
            setOpenDialog(false);
        } else {
            alert("Event Name and Calories Burned are required fields.");
        }
    };

    const generateCSV = () => {
        const csvData = [
            ["Event Name", "Calories Burned"],
            ...exerciseEvents.map((event) => [event.eventName, event.caloriesBurned]),
        ];
        const csvContent = csvData.map((row) => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
        try {
            saveAs(blob, "exercise-events.csv");
        } catch (error) {
            console.error("Error generating CSV:", error);
            alert("An error occurred while generating the CSV.");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg" style={{ marginLeft: "0px" }}>
                <div className="goal-tracker-container">
                    <Typography variant="h5">Daily Goal: {dailyGoal} calories</Typography>
                    <Typography variant="subtitle2" gutterBottom>
                        Remaining = Goal - Food + Exercise
                    </Typography>
                    {/* <Typography variant="subtitle2" gutterBottom>
                        caloriesConsumed: {caloriesConsumed}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                        caloriesBurned: {caloriesBurned}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                        dailyGoal: {dailyGoal}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                        progress: {(caloriesConsumed / dailyGoal) * 100}%
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                        Formula: cals consumed / dailygoal * 100
                    </Typography> */}
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                        <CircularProgress
                            size={150}
                            variant="determinate"
                            value={(caloriesConsumed / (dailyGoal + parseFloat(totalCaloriesBurned))) * 100}
                        />
                        <Box
                            sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: "absolute",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                            }}
                        >
                            <Typography
                                variant="h5"
                                component="div"
                                color="text.primary"
                                style={{ fontWeight: "bold" }}
                            >
                                {dailyGoal - caloriesConsumed + parseFloat(totalCaloriesBurned)}
                            </Typography>
                            <Typography
                                variant="body2"
                                component="div"
                                color="text.secondary"
                                style={{ fontSize: "smaller" }}
                            >
                                Remaining
                            </Typography>
                        </Box>
                    </Box>
                    <Typography
                        component="h2"
                        variant="h5"
                        style={{ marginBottom: "20px", marginTop: "20px" }}
                    >
                        Exercise Tracker
                    </Typography>
                    <div style={{ marginBottom: "20px" }}></div>
                    <div style={{ height: 400, width: "100%" }}>
                        <DataGrid
                            rows={exerciseEvents}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            disableSelectionOnClick
                        />
                    </div>
                    <div style={{ marginTop: "20px" }}>
                        <Button
                            variant="contained"
                            onClick={handleDialogOpen}
                            style={{ marginRight: "10px" }}
                        >
                            Add Exercise Event
                        </Button>
                        <Button variant="contained" onClick={generateCSV}>
                            Export as CSV
                        </Button>
                    </div>
                </div>
                <Dialog open={openDialog} onClose={handleDialogClose}>
                    <DialogTitle>Add New Exercise Event</DialogTitle>
                    <DialogContent>
                        <TextField
                            required
                            autoFocus
                            margin="dense"
                            label="Event Name"
                            fullWidth
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                        />
                        <TextField
                            required
                            margin="dense"
                            label="Calories Burned"
                            type="number"
                            fullWidth
                            value={caloriesBurned}
                            InputProps={{
                                inputProps: { min: 0 },
                            }}
                            onKeyPress={(event) => {
                                if (event?.key === "-" || event?.key === "+") {
                                    event.preventDefault();
                                }
                            }}
                            onChange={(e) => setCaloriesBurned(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button variant="contained" onClick={addExerciseEvent}>
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
}

export default GoalTracker;
