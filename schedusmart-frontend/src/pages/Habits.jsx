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
import { AppBar, Toolbar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { GridRowModes } from "@mui/x-data-grid";
import { LineChart } from "@mui/x-charts/LineChart";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import CheckboxList from "./CheckboxList";
import Dashboard from "./Dashboard";
import GoalTracker from "./GoalTracker";
import { red, orange, yellow, green, blue, purple, pink } from "@mui/material/colors";
import { useLocation } from 'react-router-dom';
import languageLibrary from "../components/language.json";
import send_request from "./requester.jsx";

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


// const theme = createTheme({
//   palette: {
//     primary: {
//       main: orange[500],
//     },
//     secondary: {
//       main: "#ab5600",
//     },
//   },
//   components: {
//     MuiDataGrid: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "gray",
//         },
//       },
//     },
//   },
// });



export default function Habits() {
  const [language, setLanguage] = useState(0);
  const fetchInitializeData = async () => {
    let dataOfUser = await send_request("/user_data", {
      "user_id": userId,
    });
    if (dataOfUser.language != undefined) {
      setLanguage(dataOfUser.language);
    }
  };
  let languageData = languageLibrary[language][0].habit;

  const columns = [
    { field: "itemName", headerName: languageData.itemName, width: 200 },
    { field: "calories", headerName: languageData.calories, width: 150 },
    { field: "carbs", headerName: languageData.carbs, width: 150 },
    { field: "fat", headerName: languageData.fat, width: 150 },
    { field: "protein", headerName: languageData.protein, width: 150 },
    { field: "sodium", headerName: languageData.sodium, width: 150 },
    { field: "sugar", headerName: languageData.sugar, width: 150 },
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
  const [habits, setHabits] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [itemName, setItemName] = useState("");
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [protein, setProtein] = useState("");
  const [sodium, setSodium] = useState("");
  const [sugar, setSugar] = useState("");

  const [selectedColumns, setSelectedColumns] = useState([]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedItemId, setEditedItemId] = useState("");
  const [editedItem, setEditedItem] = useState({});
  const [oldItemName, setOldItemName] = useState(""); // Storing previous name

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${flaskURL}/get_habits`, {
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
          const sortedHabits = responseData.habits.sort((a, b) => a.id - b.id);
          setHabits(sortedHabits);
        } else {
          console.error("Error fetching habits: ", response.statusText);
          alert("Failed to fetch habits. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching habits: ", error);
        alert("An error occurred while fetching habits.");
      }
    };

    fetchData();
    fetchInitializeData();
  }, []);



  const handleEditClick = (id) => {
    const itemToEdit = habits.find((habit) => habit.id.toString() === id);
    if (itemToEdit) {
      setEditedItem(itemToEdit);
      setEditedItemId(id);
      setEditDialogOpen(true);
      setOldItemName(itemToEdit.itemName);
    }
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const resetSelectedColumns = () => {
    setSelectedColumns([]);
  };

  const handleDeleteClick = async (id) => {
    // Clear selected columns when a habit is deleted
    resetSelectedColumns();
  
    try {
      // Find the habit based on the id
      const habitToDelete = habits.find((habit) => habit.id.toString() === id);
      if (!habitToDelete) {
        console.error("Error deleting habit: Habit not found");
        alert("Failed to delete habit. Habit not found.");
        return;
      }

      const response = await fetch(flaskURL + "/delete_habit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          item_name: habitToDelete.itemName, // Pass the itemName from the habit to be deleted
        }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.message); // Log success message
        
        // Remove the habit from the state
        const updatedHabits = habits.filter(
          (habit) => habit.id.toString() !== id
        );
        setHabits(updatedHabits);
      } else {
        const errorData = await response.json();
        console.error("Error deleting habit: ", errorData.error);
        alert("Failed to delete habit. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting habit: ", error);
      alert("An error occurred while deleting the habit.");
    }
};

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const saveEditedHabit = async () => {
    if (editedItem.itemName === "" || editedItem.calories=== "") {
      alert("Item Name and Calories are required fields.");
      return;
    }
    
    try {
      const response = await fetch(flaskURL + "/update_habit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          editedItem,
          old_item_name: oldItemName,
        }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.message); // Log success message
        
        // Update habits state or perform any necessary actions
        const updatedHabits = habits.map((habit) =>
          habit.id.toString() === editedItemId ? editedItem : habit
        );
        setHabits(updatedHabits);
  
        // Set the edited data in the table
        const editedRowIndex = habits.findIndex(
          (habit) => habit.id.toString() === editedItemId
        );
        if (editedRowIndex !== -1) {
          const updatedRows = [...habits];
          updatedRows[editedRowIndex] = editedItem;
          setHabits(updatedRows);
        }
        
        handleEditDialogClose();
      } else {
        const errorData = await response.json();
        console.error("Error updating habit: ", errorData.error);
        alert("Failed to update habit. Please try again.");
      }
    } catch (error) {
      console.error("Error updating habit: ", error);
      alert("An error occurred while updating the habit.");
    }
  };
  

  const addHabit = async () => {
    if (itemName.trim() !== "" && calories.trim() !== "") {
        try {
            // Fetch the highest habit ID from the Flask endpoint
            const highestIdResponse = await fetch(`${flaskURL}/get_highest_habit_id`, {
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

                // Set the ID of newHabit to the highest ID from the Flask endpoint + 1
                const newHabit = {
                    itemName: itemName.trim(),
                    id: highestId,
                    calories: parseFloat(calories),
                    carbs: parseFloat(carbs) || 0,
                    fat: parseFloat(fat) || 0,
                    protein: parseFloat(protein) || 0,
                    sodium: parseFloat(sodium) || 0,
                    sugar: parseFloat(sugar) || 0,
                };

                // Add the new habit to the database
                const response = await fetch(`${flaskURL}/add_habit`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        ...newHabit,
                    }),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log(responseData.message); // Log success message
                    // Update habits state or perform any necessary actions
                    setHabits([...habits, newHabit]);
                    // Clear input fields and close dialog
                    setItemName("");
                    setCalories("");
                    setCarbs("");
                    setFat("");
                    setProtein("");
                    setSodium("");
                    setSugar("");
                    setOpenDialog(false);
                } else {
                    const errorData = await response.json();
                    console.error("Error adding habit: ", errorData.error);
                    alert("Failed to add habit. Please try again.");
                }
            } else {
                const errorData = await highestIdResponse.json();
                console.error("Error fetching highest habit ID: ", errorData.error);
                alert("Failed to fetch highest habit ID. Please try again.");
            }
        } catch (error) {
            console.error("Error adding habit: ", error);
            alert("An error occurred while adding the habit.");
        }
    } else {
        alert("Item Name and Calories are required fields.");
    }
};

  


  const generateCSV = () => {
    const csvData = [
      [
        "Item Name",
        "Calories (kcal)",
        "Carbs (g)",
        "Fat (g)",
        "Protein (g)",
        "Sodium (mg)",
        "Sugar (g)",
      ],
      ...habits.map((habit) => [
        habit.itemName,
        habit.calories,
        habit.carbs,
        habit.fat,
        habit.protein,
        habit.sodium,
        habit.sugar,
      ]),
    ];
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    try {
      saveAs(blob, "eating-habits.csv");
    } catch (error) {
      console.error("Error generating CSV:", error);
      alert("An error occurred while generating the CSV.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>{Dashboard(language)}</div>
      <Container component="main" maxWidth="lg" style={{ marginLeft: "0px" }}>
        <div className="habits-container">
          <Typography
            component="h2"
            variant="h5"
            style={{ marginBottom: "20px", marginTop: "20px" }}
          >
            {languageData.dietTracker}
          </Typography>
          <div style={{ height: 400, width: "115%" }}>
            <DataGrid
              editMode="row"
              rows={habits.map((habit) => ({
                ...habit,
                id: habit.id.toString(),
              }))}
              columns={[
                ...columns,
                {
                  field: "actions",
                  headerName: languageData.action,
                  width: 150,
                  sortable: false,
                  disableColumnMenu: true,
                  renderCell: (params) => (
                    <>
                      <Button onClick={() => handleEditClick(params.id)}>
                        <EditIcon fontSize="small" />
                      </Button>
                      <Button onClick={() => handleDeleteClick(params.id)}>
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </>
                  ),
                },
              ]}
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
              {languageData.addNewItem}
            </Button>
            <Button variant="contained" onClick={generateCSV}>
              {languageData.exportAsCSV}
            </Button>
          </div>
          <CheckboxList
            columns={columns}
            habits={habits}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            languageData={languageData} 
          />
          <GoalTracker 
            columns={columns}
            habits={habits}
            languageData={languageData} 
          />
        </div>
        <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
          <DialogTitle>{languageData.editItem}</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              margin="dense"
              label={languageData.itemName}
              fullWidth
              value={editedItem.itemName || ""}
              onChange={(e) =>
                setEditedItem({ ...editedItem, itemName: e.target.value })
              }
            />
            <TextField
              required
              margin="dense"
              label={languageData.calories}
              type="number"
              fullWidth
              value={editedItem.calories || ""}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onKeyPress={(event) => {
                if (event?.key === "-" || event?.key === "+") {
                  event.preventDefault();
                }
              }}
              onChange={(e) =>
                setEditedItem({ ...editedItem, calories: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label={languageData.carbs}
              type="number"
              fullWidth
              value={editedItem.carbs || ""}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onKeyPress={(event) => {
                if (event?.key === "-" || event?.key === "+") {
                  event.preventDefault();
                }
              }}
              onChange={(e) =>
                setEditedItem({ ...editedItem, carbs: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label={languageData.fat}
              type="number"
              fullWidth
              value={editedItem.fat || ""}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onKeyPress={(event) => {
                if (event?.key === "-" || event?.key === "+") {
                  event.preventDefault();
                }
              }}
              onChange={(e) =>
                setEditedItem({ ...editedItem, fat: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label={languageData.protein}
              type="number"
              fullWidth
              value={editedItem.protein || ""}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onKeyPress={(event) => {
                if (event?.key === "-" || event?.key === "+") {
                  event.preventDefault();
                }
              }}
              onChange={(e) =>
                setEditedItem({ ...editedItem, protein: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label={languageData.sodium}
              type="number"
              fullWidth
              value={editedItem.sodium || ""}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onKeyPress={(event) => {
                if (event?.key === "-" || event?.key === "+") {
                  event.preventDefault();
                }
              }}
              onChange={(e) =>
                setEditedItem({ ...editedItem, sodium: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label={languageData.sugar}
              type="number"
              fullWidth
              value={editedItem.sugar || ""}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onKeyPress={(event) => {
                if (event?.key === "-" || event?.key === "+") {
                  event.preventDefault();
                }
              }}
              onChange={(e) =>
                setEditedItem({ ...editedItem, sugar: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditDialogClose}>Cancel</Button>
            <Button variant="contained" onClick={saveEditedHabit}>
            {languageData.save}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>{languageData.addNewItem}</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              margin="dense"
              label={languageData.itemName}
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              label={languageData.calories}
              type="number"
              fullWidth
              value={calories}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onKeyPress={(event) => {
                if (event?.key === "-" || event?.key === "+") {
                  event.preventDefault();
                }
              }}
              onChange={(e) => setCalories(e.target.value)}
            />
            <TextField
              margin="dense"
              label={languageData.carbs}
              type="number"
              fullWidth
              value={carbs}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onKeyPress={(event) => {
                if (event?.key === "-" || event?.key === "+") {
                  event.preventDefault();
                }
              }}
              onChange={(e) => setCarbs(e.target.value)}
            />
            <TextField
              margin="dense"
              label={languageData.fat}
              type="number"
              fullWidth
              value={fat}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onKeyPress={(event) => {
                if (event?.key === "-" || event?.key === "+") {
                  event.preventDefault();
                }
              }}
              onChange={(e) => setFat(e.target.value)}
            />
            <TextField
              margin="dense"
              label={languageData.protein}
              type="number"
              fullWidth
              value={protein}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onKeyPress={(event) => {
                if (event?.key === "-" || event?.key === "+") {
                  event.preventDefault();
                }
              }}
              onChange={(e) => setProtein(e.target.value)}
            />
            <TextField
              margin="dense"
              label={languageData.sodium}
              type="number"
              fullWidth
              value={sodium}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onKeyPress={(event) => {
                if (event?.key === "-" || event?.key === "+") {
                  event.preventDefault();
                }
              }}
              onChange={(e) => setSodium(e.target.value)}
            />
            <TextField
              margin="dense"
              label={languageData.sugar}
              type="number"
              fullWidth
              value={sugar}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onKeyPress={(event) => {
                if (event?.key === "-" || event?.key === "+") {
                  event.preventDefault();
                }
              }}
              onChange={(e) => setSugar(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>{languageData.cancel}</Button>
            <Button variant="contained" onClick={addHabit}>
            {languageData.add}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}
