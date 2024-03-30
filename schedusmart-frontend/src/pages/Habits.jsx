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
import { orange } from "@mui/material/colors";
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

const flaskURL = "http://127.0.0.1:5000"; // Update with your backend URL
const userId = sessionStorage.getItem("user_id");

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
  { field: "itemName", headerName: "Item Name", width: 200 },
  { field: "calories", headerName: "Calories (kcal)", width: 150 },
  { field: "carbs", headerName: "Carbs (g)", width: 150 },
  { field: "fat", headerName: "Fat (g)", width: 150 },
  { field: "protein", headerName: "Protein (g)", width: 150 },
  { field: "sodium", headerName: "Sodium (mg)", width: 150 },
  { field: "sugar", headerName: "Sugar (g)", width: 150 },
];

export default function Habits() {
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
          setHabits(responseData.habits);
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
      const newHabit = {
        itemName: itemName.trim(),
        id: habits.length + 1,
        calories: parseFloat(calories),
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
        protein: parseFloat(protein) || 0,
        sodium: parseFloat(sodium) || 0,
        sugar: parseFloat(sugar) || 0,
      };
  
      try {
        const response = await fetch(flaskURL + "/add_habit", {
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
      <div>{Dashboard()}</div>
      <Container component="main" maxWidth="lg" style={{ marginLeft: "0px" }}>
        <div className="habits-container">
          <Typography
            component="h2"
            variant="h5"
            style={{ marginBottom: "20px", marginTop: "20px" }}
          >
            Calorie Tracker
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
                  headerName: "Actions",
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
              Add new Item
            </Button>
            <Button variant="contained" onClick={generateCSV}>
              Export as CSV
            </Button>
          </div>
          <CheckboxList
            columns={columns}
            habits={habits}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
          />
        </div>
        <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              margin="dense"
              label="Item Name"
              fullWidth
              value={editedItem.itemName || ""}
              onChange={(e) =>
                setEditedItem({ ...editedItem, itemName: e.target.value })
              }
            />
            <TextField
              required
              margin="dense"
              label="Calories (kcal)"
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
              label="Carbs (g)"
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
              label="Fat (g)"
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
              label="Protein (g)"
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
              label="Sodium (mg)"
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
              label="Sugar (g)"
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
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              margin="dense"
              label="Item Name"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              label="Calories (kcal)"
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
              label="Carbs (g)"
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
              label="Fat (g)"
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
              label="Protein (g)"
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
              label="Sodium (mg)"
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
              label="Sugar (g)"
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
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button variant="contained" onClick={addHabit}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}
