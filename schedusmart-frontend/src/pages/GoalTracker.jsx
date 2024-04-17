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
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { red, orange, yellow, green, blue, purple, pink } from "@mui/material/colors";
import { useLocation } from 'react-router-dom';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { parse } from "uuid";

const flaskURL = "http://127.0.0.1:5000"; // Update with your backend URL
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

const columns = [
    { field: "eventName", headerName: "Workout Name", width: 200 },
    { field: "caloriesBurned", headerName: "Calories Burned", width: 200 },
];

function GoalTracker({ habits }) {
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

    const [exerciseEvents, setExerciseEvents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [eventName, setEventName] = useState("");
    const [caloriesBurned, setCaloriesBurned] = useState(0); // Burned calories, taken from Exercise Tracker table
    const [dailyGoal, setDailyGoal] = useState(2000); // daily goal, set by user in future
    const [caloriesConsumed, setCaloriesConsumed] = useState(0); // Consumed calories, taken from Habits.jsx table
    const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0); // Total calories burned

    useEffect(() => {
        // Fetch all exercises when component mounts
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const response = await fetch(`${flaskURL}/get_exercises`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                const sortedExerciseEvents = responseData.exercises.sort((a, b) => a.id - b.id);
                setExerciseEvents(sortedExerciseEvents);
            } else {
                const errorData = await response.json();
                console.error("Error fetching exercises: ", errorData.error);
                alert("Failed to fetch exercises. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching exercises: ", error);
            alert("An error occurred while fetching exercises.");
        }
    };
    
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

    const addExerciseEvent = async () => {
        if (eventName.trim() !== "" && caloriesBurned.trim() !== "") {
            const newEvent = {
                eventName: eventName.trim(), 
                id: exerciseEvents.length + 1,
                caloriesBurned: parseFloat(caloriesBurned),
            };
    
            try {
                const response = await fetch(`${flaskURL}/add_exercise`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        id: newEvent.id, 
                        caloriesBurned: newEvent.caloriesBurned, 
                        eventName: newEvent.eventName, 
                    }),
                });
    
                if (response.ok) {
                    const responseData = await response.json();
                    console.log(responseData.message);
    
                    setExerciseEvents([...exerciseEvents, newEvent]);
    
                    setEventName("");
                    setOpenDialog(false);
                } else {
                    const errorData = await response.json();
                    console.error("Error adding exercise event: ", errorData.error);
                    alert("Failed to add exercise event. Please try again.");
                }
            } catch (error) {
                console.error("Error adding exercise event: ", error);
                alert("An error occurred while adding the exercise event.");
            }
        } else {
            alert("Workout Name and Calories Burned are required fields.");
        }
    };
    
    const generateCSV = () => {
        const csvData = [
            ["Workout Name", "Calories Burned"],
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

    const settings = {
        width: 200,
        height: 200,
        valueMin: 0,
        valueMax: dailyGoal,
        value: caloriesConsumed - parseFloat(totalCaloriesBurned),
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
                        caloriesBurned: {parseFloat(totalCaloriesBurned)}
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
                    <Box sx={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                        <Gauge
                                {...settings}
                                cornerRadius="50%"
                                sx={(theme) => ({
                                    [`& .${gaugeClasses.valueText}`]: {
                                        // If remaining calories is <= 0, set font size to 30
                                        fontSize: (dailyGoal - caloriesConsumed + parseFloat(totalCaloriesBurned)) <= 0 ? 25 : 37,
                                        fontWeight: "bold",
                                    },
                                    [`& .${gaugeClasses.valueArc}`]: {
                                        fill: (() => {
                                            if ((dailyGoal - caloriesConsumed + parseFloat(totalCaloriesBurned)) <= 0) {
                                                return '#2e7d32' // Arc is green if remaining calories is <= 0
                                            } 
                                        })(),
                                    },
                                    [`& .${gaugeClasses.referenceArc}`]: {
                                        fill: theme.palette.text.disabled,
                                    },
                                })}
                                text={(() => {
                                    const remainingCalories = dailyGoal - caloriesConsumed + parseFloat(totalCaloriesBurned);
                                    if (remainingCalories <= 0) {
                                        return "Complete!";
                                    } else {
                                        return `${remainingCalories}`;
                                    }
                                })()}
                            />
                        {(dailyGoal - caloriesConsumed + parseFloat(totalCaloriesBurned)) > 0 && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            style={{
                                fontSize: "smaller",
                                position: "absolute",
                                bottom: "35%", 
                                left: "50%", 
                                transform: "translate(-50%, 50%)", 
                            }}
                        >
                            Remaining
                        </Typography> )}
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
                            Add Workout
                        </Button>
                        <Button variant="contained" onClick={generateCSV}>
                            Export as CSV
                        </Button>
                    </div>
                </div>
                <Dialog open={openDialog} onClose={handleDialogClose}>
                    <DialogTitle>Add New Workout</DialogTitle>
                    <DialogContent>
                        <TextField
                            required
                            autoFocus
                            margin="dense"
                            label="Workout Name"
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
