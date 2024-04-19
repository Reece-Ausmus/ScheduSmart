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
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

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


function GoalTracker({ habits, languageData }) {
    const columns = [
        { field: "eventName", headerName: languageData.workoutName, width: 200 },
        { field: "caloriesBurned", headerName: languageData.caloriesBurn, width: 200 },
    ];
    const location = useLocation();
    let Color;
    if (location.state == null) {
      Color = sessionStorage.getItem('system_color');
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
    const [openDialog, setOpenDialog] = useState(false); // State for Exercise adding dialog
    const [openGoalDialog, setOpenGoalDialog] = useState(false); // State for goal setting dialog
    const [eventName, setEventName] = useState("");
    const [caloriesBurned, setCaloriesBurned] = useState(0); // Burned calories, taken from Exercise Tracker table
    const [dailyGoal, setDailyGoal] = useState(2000); // daily goal, set by user. default is 2000
    const [newDailyGoal, setNewDailyGoal] = useState(''); // New state variable for the goal setting dialog
    const [caloriesConsumed, setCaloriesConsumed] = useState(0); // Consumed calories, taken from Habits.jsx table
    const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0); // Total calories burned
    const [status, setStatus] = useState("fail"); // Whether the goal has been met or not
    const [pastStatus, setPastStatus] = useState([]); // Status of past goals
    const [pastDate, setPastDate] = useState([]); // Date of past goals
    const [pastCalorieGoal, setPastCalorieGoal] = useState([]); // Calorie goal of past goals

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

    const handleGoalDialogOpen = () => {
        setOpenGoalDialog(true);
    };
    
    const handleGoalDialogClose = () => {
        setOpenGoalDialog(false);
    };

    const addExerciseEvent = async () => {
        if (eventName.trim() !== "" && caloriesBurned.trim() !== "") {
            try {
                // Fetch the highest exercise ID from the Flask endpoint
                const highestIdResponse = await fetch(`${flaskURL}/get_highest_exercise_id`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: userId,
                    }),
                });
    
                if (highestIdResponse.ok) {
                    const highestIdData = await highestIdResponse.json();
                    // Get the highest ID from the response
                    const highestId = highestIdData.highest_id || 0;
    
                    // Set the ID of newEvent to the highest ID from the Flask endpoint + 1
                    const newEvent = {
                        eventName: eventName.trim(), 
                        id: highestId,
                        caloriesBurned: parseFloat(caloriesBurned),
                    };
    
                    // Add the new event to the database
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
                } else {
                    const errorData = await highestIdResponse.json();
                    console.error("Error fetching highest exercise ID: ", errorData.error);
                    alert("Failed to fetch highest exercise ID. Please try again.");
                }
            } catch (error) {
                console.error("Error adding exercise event: ", error);
                alert("An error occurred while adding the exercise event.");
            }
        } else {
            alert("Workout Name and Calories Burned are required fields.");
        }
    };
    

    useEffect(() => {
        // Check if the goal is completed whenever dailyGoal, caloriesConsumed, or totalCaloriesBurned changes
        const remainingCalories = dailyGoal - caloriesConsumed + parseFloat(totalCaloriesBurned);
        if (remainingCalories <= 0) {
            setStatus("pass");
            //handleSetGoal();
        } else {
            setStatus("fail");
            //handleSetGoal();
        }
    }, [dailyGoal, caloriesConsumed, parseFloat(totalCaloriesBurned)]);

    const handleSetGoal = async () => {
        if (newDailyGoal !== '' && !isNaN(newDailyGoal) && parseFloat(newDailyGoal) > 0) {
            // Update dailyGoal only when newDailyGoal is valid
            setDailyGoal(parseFloat(newDailyGoal));
        }
        setOpenGoalDialog(false);

        if (newDailyGoal == '') {
            alert("Please enter a goal.");
            return;
        }
        
        const today = new Date();
        const dateString = today.toISOString().split("T")[0]; // Get today's date as a string

        const goalData = {
            user_id: userId,
            date: dateString,
            dailyGoal: parseFloat(newDailyGoal),
            status: status, 
        };

        // If goal is empty, alert the user
        if (dailyGoal === "") {
            alert("Please enter a goal.");
            return;
        }

        try {
            const response = await fetch(`${flaskURL}/set_calorie_goal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(goalData),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData.message);
                // Handle success if needed
            } else {
                const errorData = await response.json();
                console.error("Error setting calorie goal: ", errorData.error);
                alert("Failed to set calorie goal. Please try again.");
            }
        } catch (error) {
            console.error("Error setting calorie goal: ", error);
            alert("An error occurred while setting the calorie goal.");
        }
    };

    const handleDeleteEvent = async (id) => {
        try {
            const response = await fetch(`${flaskURL}/delete_exercise`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                    event_name: exerciseEvents.find((event) => event.id === id).eventName,
                }),
            });
    
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData.message);
            }
        } catch (error) {
            console.error("Error deleting exercise event: ", error);
            alert("An error occurred while deleting the exercise event.");
        }
    };

    const getDailyGoal = async () => {
        try {
            const response = await fetch(`${flaskURL}/get_calorie_goal`, {
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
                const goals = responseData.goal;
                const today = new Date();
                const dateString = today.toISOString().split("T")[0]; // Get today's date as a string
    
                // Check if today's goal exists in Firebase
                const todaysGoal = goals.find(goal => goal.date === dateString);
    
                if (todaysGoal) {
                    // If today's goal exists, set dailyGoal to the retrieved value
                    setDailyGoal(todaysGoal.dailyGoal);
                } else {
                    // If today's goal does not exist, set dailyGoal to default 2000
                    console.log("Today's goal not found in Firebase, setting to default 2000");
                    setDailyGoal(2000);
                }
                
                const pastGoals = goals.filter(goal => goal.date !== dateString);
                const sortedGoals = pastGoals.sort((a, b) => new Date(b.date) - new Date(a.date));
                setPastStatus(sortedGoals.map(goal => goal.status));
                setPastDate(sortedGoals.map(goal => goal.date));
                setPastCalorieGoal(sortedGoals.map(goal => goal.dailyGoal));


            } else {
                const errorData = await response.json();
                console.error("Error getting calorie goal: ", errorData.error);
                alert("Failed to get calorie goal. Please try again.");
            }
        } catch (error) {
            console.error("Error getting calorie goal: ", error);
            alert("An error occurred while getting the calorie goal.");
        }
    };
    
    useEffect(() => {
        // Fetch the daily goal when the component mounts
        getDailyGoal();
    }, []);
    
    
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

    const pastGoalSettings = {
        width: 200,
        height: 200,
        valueMin: 0,
        valueMax: 100,
        // check past statuses, if pass set value to 100, else set to 0
        value: 100,
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg" style={{ marginLeft: "0px" }}>
                <div className="goal-tracker-container">
                    <Typography variant="h5">
                        {languageData.dailyGoal}{dailyGoal}{languageData.calories}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                        {languageData.remaininggoal}
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
                        {/* Past goals rendering*/}
                        {pastDate.length > 0 && pastDate.map((date, index) => (
                            <React.Fragment key={index}>
                                <Gauge
                                    {...pastGoalSettings}
                                    cornerRadius="50%"
                                    sx={(theme) => ({
                                        [`& .${gaugeClasses.valueText}`]: {
                                            // If remaining calories is <= 0, set font size to 30
                                            fontSize: 25,
                                            fontWeight: "bold",
                                        },
                                        [`& .${gaugeClasses.valueArc}`]: {
                                            fill: (() => {
                                                if (pastStatus[index].includes("pass")) {
                                                    return '#2e7d32'; // Arc is green if prior goal is met
                                                } else if (pastStatus[index].includes("fail")) {
                                                    return '#AA4A44'; // Arc is red if prior goal is not met
                                                }
                                            })(),
                                        },
                                        [`& .${gaugeClasses.referenceArc}`]: {
                                            fill: theme.palette.text.disabled,
                                        },
                                    })}
                                    text={(() => {
                                        if (pastStatus[index].includes("pass")) {
                                            return "Complete!";
                                        } else {
                                            return "Failed";
                                        }
                                    })()}
                                    style={{
                                        position: "absolute",
                                        bottom: "0%", 
                                        left: `${150 + (index * 50)}%`, 
                                        right: "0%",
                                        marginLeft: `${index * 200}px`, // Add horizontal spacing between gauges
                                    }}
                                />
                                <Typography
                                    // bold
                                    fontWeight={1000}
                                    color="text.secondary"
                                    style={{
                                        position: "absolute",
                                        bottom: "-30%", 
                                        left: `${168 + (index * 150)}%`, 
                                        width: "86%",
                                    }}
                                >
                                    {/* Print all past dates in array */}
                                    {date && `Date: ${date}\n`}
                                    {/* Print all past calorie goals in array on a new line */}
                                    {pastCalorieGoal[index] && `Goal: ${pastCalorieGoal[index]} calories`}
                                </Typography>
                            </React.Fragment>
                        ))}
                        
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
                            {languageData.remaining}
                        </Typography> )}
                    </Box>
                    
                    <Button
                        variant="contained"
                        onClick={handleGoalDialogOpen} // Open the goal setting dialog
                        style={{ marginTop: "60px", marginLeft: "-150px" }}
                    >
                        {languageData.setGoal}
                    </Button>
                    <Typography
                        component="h2"
                        variant="h5"
                        style={{ marginBottom: "20px", marginTop: "40px" }}
                    >
                        {languageData.exerciseTracker}
                    </Typography>
                    <div style={{ marginBottom: "20px" }}></div>
                    <div style={{ height: 400, width: "100%" }}>
                        <DataGrid
                            rows={exerciseEvents}
                            columns={[...columns,
                                {
                                    field: "delete",
                                    headerName: languageData.delete,
                                    width: 100,
                                    renderCell: (params) => (
                                        <Button

                                            onClick={() => {
                                                handleDeleteEvent(params.row.id);
                                                setExerciseEvents(
                                                    exerciseEvents.filter((event) => event.id !== params.row.id),
                                                );
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </Button>
                                    ),
                                },]}
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
                            {languageData.addWorkout}
                        </Button>
                        <Button variant="contained" onClick={generateCSV}>
                            {languageData.exportAsCSV}
                        </Button>
                    </div>
                </div>
                <Dialog open={openGoalDialog} onClose={handleGoalDialogClose}>
                    <DialogTitle>{languageData.setDailyGoal}</DialogTitle>
                    <DialogContent>
                        {/* Form fields for setting daily goal */}
                        <TextField
                        required
                        autoFocus
                        margin="dense"
                        label={languageData.dailyGoal + " (" + languageData.calorie+")"}
                        fullWidth
                        value={newDailyGoal}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Check if the value is a positive number or empty
                            if (value === '' || (parseFloat(value) > 0 && !isNaN(value))) {
                                setNewDailyGoal(value);
                            }
                        }}
                        type="number"
                        inputProps={{
                            min: "0", // Ensure the input doesn't accept negative numbers
                        }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleGoalDialogClose} style={{ marginRight: "35px" }}>{languageData.cancel}</Button>
                        <Button variant="contained" onClick={handleSetGoal}>
                        {languageData.confirmNewGoal}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openDialog} onClose={handleDialogClose}>
                    <DialogTitle>{languageData.addNewWorlout}</DialogTitle>
                    <DialogContent>
                        <TextField
                            required
                            autoFocus
                            margin="dense"
                            label={languageData.workoutName}
                            fullWidth
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                        />
                        <TextField
                            required
                            margin="dense"
                            label={languageData.caloriesBurned}
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
                        <Button onClick={handleDialogClose}>{languageData.cancel}</Button>
                        <Button variant="contained" onClick={addExerciseEvent}>
                            {languageData.add}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
}

export default GoalTracker;
