import React, { useState } from "react";
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
import { orange, yellow } from "@mui/material/colors";
import { DataGrid } from "@mui/x-data-grid";
import "./Habits.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { GridRowModes } from "@mui/x-data-grid";
import { LineChart } from '@mui/x-charts/LineChart';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import CheckboxList from "./CheckboxList";

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

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedItemId, setEditedItemId] = useState("");
  const [editedItem, setEditedItem] = useState({});

  const handleEditClick = (id) => {
    const itemToEdit = habits.find((habit) => habit.id.toString() === id);
    if (itemToEdit) {
      setEditedItem(itemToEdit);
      setEditedItemId(id);
      setEditDialogOpen(true);
    }
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleDeleteClick = (id) => {
    const updatedHabits = habits.filter((habit) => habit.id.toString() !== id);
    setHabits(updatedHabits);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const saveEditedHabit = () => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id.toString() === editedItemId) {
        return {
          ...habit,
          itemName: editedItem.itemName,
          calories: editedItem.calories,
          carbs: editedItem.carbs,
          fat: editedItem.fat,
          protein: editedItem.protein,
          sodium: editedItem.sodium,
          sugar: editedItem.sugar,
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
    handleEditDialogClose();
  };

  const addHabit = () => {
    if (itemName.trim() !== "" && calories.trim() !== "") {
      const newHabit = {
        id: habits.length + 1,
        itemName: itemName.trim(),
        calories: parseFloat(calories),
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
        protein: parseFloat(protein) || 0,
        sodium: parseFloat(sodium) || 0,
        sugar: parseFloat(sugar) || 0,
      };
      setHabits([...habits, newHabit]);
      setItemName("");
      setCalories("");
      setCarbs("");
      setFat("");
      setProtein("");
      setSodium("");
      setSugar("");
      handleDialogClose();
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
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Button variant="contained" href="./calendar">
            <CalendarMonthIcon sx={{ marginRight: 1 }} />
            <Typography variant="body1">ScheduSmart</Typography>
          </Button>
          <div>
            <Button color="inherit" href="./settings">
              Settings
            </Button>
            <Button variant="inherit" href="./calendar">
                <CalendarMonthIcon sx={{ marginRight: 1 }} />
            </Button>
            <Button color="secondary">Habits</Button>
            <Button color="inherit" href="./notes">
              Notes
            </Button>
            <Button color="inherit" href="./signout">
              Sign Out
            </Button>
          </div>
        </Toolbar>
      </AppBar>
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
          <CheckboxList columns={columns} habits={habits} />
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
                inputProps: { min: 0 }
              }}
              onKeyPress={(event) => {
                if (event?.key === '-' || event?.key === '+') {
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
                inputProps: { min: 0 }
              }}
              onKeyPress={(event) => {
                if (event?.key === '-' || event?.key === '+') {
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
                inputProps: { min: 0 }
              }}
              onKeyPress={(event) => {
                if (event?.key === '-' || event?.key === '+') {
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
                inputProps: { min: 0 }
              }}
              onKeyPress={(event) => {
                if (event?.key === '-' || event?.key === '+') {
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
                inputProps: { min: 0 }
              }}
              onKeyPress={(event) => {
                if (event?.key === '-' || event?.key === '+') {
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
                inputProps: { min: 0 }
              }}
              onKeyPress={(event) => {
                if (event?.key === '-' || event?.key === '+') {
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
            <Button onClick={saveEditedHabit}>Save</Button>
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
                inputProps: { min: 0 }
              }}
              onKeyPress={(event) => {
                if (event?.key === '-' || event?.key === '+') {
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
                inputProps: { min: 0 }
              }}
              onKeyPress={(event) => {
                if (event?.key === '-' || event?.key === '+') {
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
                inputProps: { min: 0 }
              }}
              onKeyPress={(event) => {
                if (event?.key === '-' || event?.key === '+') {
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
                inputProps: { min: 0 }
              }}
              onKeyPress={(event) => {
                if (event?.key === '-' || event?.key === '+') {
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
                inputProps: { min: 0 }
              }}
              onKeyPress={(event) => {
                if (event?.key === '-' || event?.key === '+') {
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
                inputProps: { min: 0 }
              }}
              onKeyPress={(event) => {
                if (event?.key === '-' || event?.key === '+') {
                  event.preventDefault();
                }
              }}
              onChange={(e) => setSugar(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={addHabit}>Add</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}
