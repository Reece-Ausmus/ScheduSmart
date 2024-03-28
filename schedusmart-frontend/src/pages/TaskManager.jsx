import React, { useState, useEffect } from "react";
import "./TaskManager.css";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import FileUpload from "./FileUpload";
import { storage } from "./Firebase"
import { listAll, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import CssBaseline from "@mui/material/CssBaseline";
import { v4 } from "uuid"
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange, grey } from "@mui/material/colors";
import Fab from '@mui/material/Fab';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';;
import TextField from '@mui/material/TextField';
import EventParser from "./EventParser"
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Table, TableHead, TableBody, TableRow, TableCell, Grid } from '@mui/material';
import send_request from "./requester";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Dashboard from "./Dashboard";


// Define the Flask API URL
const flaskURL = "http://127.0.0.1:5000";

// user_id to get user info
const userId = sessionStorage.getItem("user_id");

const theme = createTheme({
  palette: {
    primary: orange,
    secondary: {
      main: "#ab5600",
    },
    // background: {
    //   default: "#fff8e1",
    // },
  },
});

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const handleCreateTaskCalendar = async () => {
  const new_calendar = {
    newCalendarName: "tasks",
    user_id: userId,
  };
  const response = await fetch(flaskURL + "/create_calendar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(new_calendar),
    credentials: "include",
  });
  if (!response.ok) {
    alert("Something went wrong, refresh your website!");
    return;
  } else {
    switch (response.status) {
      case 201:
        console.log("Calendar created successfully");
        const responseData = await response.json();
        break;
      case 205:
        alert("Calendar not created!");
        break;
      case 206:
        alert("Missing information!");
        break;
      case 207:
        alert("Calendar not added to user!");
        break;
    }
  }
};

// valid file extension list
const validExtensions = ["txt", "rtf", "docx", "csv", "doc", "wps", "wpd", "msg",
  "jpg", "png", "webp", "gif", "tif", "bmp", "eps", "mp3",
  "wma", "snd", "wav", "ra", "au", "aac", "mp4", "3gp",
  "avi", "mpg", "mov", "wmv", "xlsx", "pdf"];


// initial list for new users
const initialList = [
  {
    id: 0,
    title: "Homework 2",
    time: 4,
    date: "2024-02-25",
    desc: "Complete design document and sumbit",
    completed: false,
    completed_time: null,
    sub_tasks: [{ id: 0, name: "Question 1", comp: true },
    { id: 1, name: "Question 2", comp: true },
    { id: 2, name: "Question 3", comp: false },],
    file_url: `files/Design Document.pdfd61026c6-3875-4dbc-b542-fbc0c987a25a`,
    scheduled: false,
  },
  {
    id: 1,
    title: "Sprint Planning",
    time: 2,
    date: "2024-09-23",
    desc: "Speak with team coordinator",
    completed: false,
    completed_time: null,
    sub_tasks: [{ id: 0, name: "Backlog", comp: false },
    { id: 1, name: "User Stories", comp: false },
    { id: 2, name: "Acceptable Criteria", comp: false },],
    file_url: `files/Design Document.pdfd61026c6-3875-4dbc-b542-fbc0c987a25a`,
    scheduled: false,
  },
  {
    id: 2,
    title: "Midterm Study",
    time: 5,
    date: "2059-09-23",
    desc: "Look at slides lol",
    completed: false,
    completed_time: null,
    sub_tasks: [{ id: 0, name: "Chapter 1", comp: true },
    { id: 1, name: "Chapter 2", comp: false },
    { id: 2, name: "Chapter 3", comp: false },],
    file_url: `files/Design Document.pdfd61026c6-3875-4dbc-b542-fbc0c987a25a`,
    scheduled: false,
  },
];
let nextId = initialList.length;
let calendarId = 0;


// create new task manager
export default function TaskManager() {
  const handleInfo = async (event) => {
    const response = await fetch(flaskURL + "/user_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
      }),
      credentials: "include",
    });
    if (!response.ok) {
      alert("Account Info Not Found. Please log-out and log-in again");
    } else {
      switch (response.status) {
        case 201:
          const responseData = await response.json();
          const userId = responseData.user_id;
          if (responseData.task_list !== null && responseData.task_list !== undefined) {
            let temporaryToDoList = [];
            let temporaryCompleteList = [];
            responseData.task_list.map((task) => {
              task.completed ? temporaryCompleteList.push(task) : temporaryToDoList.push(task);
            });
            console.log("TodoList", temporaryToDoList);
            console.log("CompleteList", temporaryCompleteList);
            setTodoList(temporaryToDoList)
            setCompletedList(temporaryCompleteList);
            nextId = todoList.length;
          }
          console.log(userId);
          if (responseData.calendars == null) {
            handleCreateTaskCalendar()
          } else if (responseData.calendars["tasks"] == null) {
            handleCreateTaskCalendar()
          } else {
            calendarId = responseData.calendars["tasks"].calendar_id;
          }
          break;
        case 202:
          alert("List Not Found");
          break;
        case 205:
          alert("Failing to retrieve user data");
          break;
      }
    }
  };

  useEffect(() => {
    handleInfo();
    nextId = todoList.length;
  }, []);

  // select sort option
  const [sortOptionTodo, setSortOptionTodo] = useState(0);
  const [sortOptionCompleted, setSortOptionCompleted] = useState(0);
  const [todoList, setTodoList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [eventList, setEventList] = useState({});

  // used to hold data for tasks
  const [taskName, setTaskName] = useState("");
  const [taskTime, setTaskTime] = useState(0);
  const [taskDate, setTaskDate] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskFile, setTaskFile] = useState();

  const [subtaskList, setSubtaskList] = useState([]);
  const [subtaskDesc, setSubtaskDesc] = useState("");
  const [file, setFile] = useState(null)

  // Task creator pop-up
  const modal = document.querySelector("#modal");
  const openModal = document.querySelector("#openModal");
  const closeModal = document.querySelector("#closeModal");

  if (modal) {
    openModal && openModal.addEventListener("click", () => modal.showModal());

    closeModal && closeModal.addEventListener("click", () => modal.close());
  }

  // handle completion checkbox toggle
  function handleToggleCompleted(taskID, completedStatus) {
    let taskToUpdate = todoList.find((task) => task.id === taskID);
    if (!taskToUpdate) {
      taskToUpdate = completedList.find((task) => task.id === taskID);
    }
    if (!taskToUpdate) {
      return;
    }
    const currentTime = new Date().toLocaleString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const updatedTask = {
      ...taskToUpdate,
      completed: completedStatus,
      completed_time: completedStatus ? currentTime : null,
    };
    if (completedStatus) {
      setCompletedList((completedList) => [...completedList, updatedTask]);
      setTodoList((todoList) => todoList.filter((task) => task.id !== taskID));
    } else {
      setTodoList((todoList) => [...todoList, updatedTask]);
      setCompletedList((completedList) =>
        completedList.filter((task) => task.id !== taskID)
      );
    }
  }

  function handleToggleSubtask(id, sub_id, checked) {
    let mapped = todoList.map((task) => {
      if (task.id == id) {
        let sub_mapped = task.sub_tasks.map((sub_task) => {
          return sub_task.id == sub_id ? { ...sub_task, comp: checked } : { ...sub_task };
        })
        return { ...task, sub_tasks: sub_mapped }
      } else {
        return { ...task };
      }
    })
    setTodoList(mapped)
  }

  function handleScheduledTask(id) {
    let mapped = todoList.map((task) => {
      if (task.id == id) {
        return { ...task, scheduled: true }
      } else {
        return { ...task }
      }
    })
    setTodoList(mapped)
  }

  // search list
  const [searchQueryTodo, setSearchQueryTodo] = useState("");
  const [searchQueryCompleted, setSearchQueryCompleted] = useState("");
  const [foundList, setFoundList] = useState(todoList);

  // filter list
  const filterTodo = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = todoList.filter((task) => {
        return (
          task.title.toLowerCase().includes(keyword.toLowerCase()) ||
          task.desc.toLowerCase().includes(keyword.toLowerCase())
        );
      });
      setFoundList(results);
    } else {
      setFoundList(todoList);
    }

    setSearchQueryTodo(keyword);
  };

  const filterCompleted = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = completedList.filter((task) => {
        return (
          task.title.toLowerCase().includes(keyword.toLowerCase()) ||
          task.desc.toLowerCase().includes(keyword.toLowerCase())
        );
      });
      setFoundList(results);
    } else {
      setFoundList(completedList);
    }

    setSearchQueryTodo(keyword);
  };


  const [selectedFormat, setSelectedFormat] = useState("pdf");

  // export to pdf
  const generatePDF = () => {
    const doc = new jsPDF();
    // Add title
    doc.setFontSize(20);
    doc.text("To-Do List", doc.internal.pageSize.getWidth() / 2, 20, "center");
    doc.setFontSize(12);

    // Add to-do list items with spacing
    const yStart = 40; // Starting y-coordinate
    let y = yStart; // Current y-coordinate
    const lineHeight = 10; // Spacing between items

    todoList.forEach((task) => {
      // Add task title
      doc.setFont("helvetica", "bold");
      doc.text(task.title, 15, y);
      doc.setFont("helvetica", "normal");

      y += lineHeight;

      doc.text(task.desc, 15, y);
      y += lineHeight;
      doc.text(`${task.time} hour(s) - ${task.date}`, 15, y);
      y += lineHeight;

      // Add separator line
      doc.setLineWidth(0.5);
      doc.line(15, y + 2, doc.internal.pageSize.getWidth() - 15, y + 2);
      y += lineHeight * 2; // Increase spacing after separator
    });

    // Add a space between To-Do and Completed sections
    y += lineHeight * 2;

    // Add heading for Completed tasks
    doc.setFont("helvetica", "bold");
    doc.text("Completed Tasks", 15, y);
    doc.setFont("helvetica", "normal");
    y += lineHeight;

    // Add completed task items with spacing (modify as needed)
    completedList.forEach((task) => {
      doc.text(task.title, 15, y);
      y += lineHeight * 2;  // Adjust spacing as needed
    });

    try {
      // Trigger download without opening the document in a new tab
      doc.save("task-list.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "An error occurred while generating the PDF. Please try again or check your browser's settings."
      );
    }
  };

  // export to csv
  const generateCSV = () => {
    const allTasks = [...todoList, ...completedList]; // Combine all tasks
    const csvData = [
      ["ID", "Title", "Description", "Workload (hours)", "Deadline", "Completed", "Completed Time"],
      ...allTasks.map((task) => [
        task.id,
        task.title,
        task.desc,
        task.time,
        task.date,
        task.completed,
        task.completed_time ? new Date(task.completed_time).toLocaleString() : "",
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    try {
      saveAs(blob, "task-list.csv");
    } catch (error) {
      console.error("Error generating CSV:", error);
      alert(
        "An error occurred while generating the CSV. Please check your browser's settings or try a different format."
      );
    }
  };

  const handleExport = () => {
    if (selectedFormat === "pdf") {
      generatePDF();
    } else if (selectedFormat === "csv") {
      generateCSV();
    } else {
      // Handle invalid format selection
      console.error("Invalid export format selected:", selectedFormat);
    }
  };

  function uploadFile(fileRef, file) {
    uploadBytes(fileRef, file).then(() => {
      console.log("File Uploaded")
    }).then(() => {
      getDownloadURL(fileRef).then((url) => {
        console.log(url)
      })
    })
  }

  const saveTasks = async () => {
    let saveList = [...todoList, ...completedList]
    console.log(saveList);
    const info = {
      user_id: userId,
      task_list: saveList,
    };
    const response = await fetch(flaskURL + "/update_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    });
    if (!response.ok) {
      alert("something went wrong, refresh your website");
    } else {
      switch (response.status) {
        case 201:
          console.log("Updated task list!");
          alert("Task list saved!")
          break;
        case 205:
          console.log("Failed to save task list! Check Connection!");
          alert("Failed to save task list! Check New Information!");
          break;
        case 206:
          console.log("Saved task list! Missing info!");
          alert("Failed to save task list!");
          break;
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div>{Dashboard()}</div>
      <CssBaseline />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1>Task List</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="f_format">Option</InputLabel>
              <Select
                labelId="f_forma"
                id="f_forma"
                value={selectedFormat}
                label="f_forma"
                onChange={(e) => setSelectedFormat(e.target.value)}
                style={{ minWidth: '120px' }}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleExport}>Export as {selectedFormat.toUpperCase()}</Button>
            <Button variant="contained" onClick={() => { window.location.href = "/dashboard"; }}>Dashboard</Button>
          </div>
        </div>
      </div>


      <div className="task-columns-container">
        <div className="task-column">
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ margin: 0 }}>To Do</h2>
                <Fab
                  aria-label="add"
                  color="primary"
                  id="openModal"
                  onClick={() => {
                    setTaskName("New Task");
                    setTaskTime(0);
                    setTaskDesc("Task Description");
                    setSubtaskDesc("");
                    setSubtaskList([]);
                    setTaskFile("");
                  }}
                >
                  <AddIcon />
                </Fab>
              </div>
            </Grid>
            <Grid item>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TextField
                  type="search"
                  label="Search"
                  variant="outlined"
                  value={searchQueryTodo}
                  onChange={filterTodo}
                  style={{ width: '200px' }}
                  size="small"
                />
                <FormControl sx={{ m: 1, width: 200 }} size="small">
                  <InputLabel id="sorting">Sort</InputLabel>
                  <Select
                    labelId="sorting"
                    id="sorting"
                    value={sortOptionTodo}
                    label="sorting"
                    onChange={(e) => setSortOptionTodo(e.target.value)}
                  >
                    <MenuItem value={0}>Sort By</MenuItem>
                    <MenuItem value={1}>Earliest created</MenuItem>
                    <MenuItem value={2}>Latest created</MenuItem>
                    <MenuItem value={3}>Earliest due</MenuItem>
                    <MenuItem value={4}>Latest due</MenuItem>
                    <MenuItem value={5}>Largest workload</MenuItem>
                    <MenuItem value={6}>Smallest workload</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </Grid>
          </Grid>
          <dialog id="modal">
            <label htmlFor="name">Task Name:</label>
            <input
              id="name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <label htmlFor="time">Workload:</label>
            <input
              type="number"
              id="time"
              min="1"
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
            />
            <label htmlFor="date">Due Date:</label>
            <input
              type="date"
              id="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
            />
            <label htmlFor="desc">Description:</label>
            <input
              id="desc"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
            />
            <input
              type="file"
              onChange={(event) => {
                let file_exen = event.target.files[0].name.split(".").pop()
                let valid = false
                validExtensions.map((extension) => {
                  if (file_exen === extension)
                    valid = true;
                })
                if (valid) {
                  setFile(event.target.files[0])
                  let ref_url = `files/${event.target.files[0].name + v4()}`
                  const fileRef = ref(storage, ref_url);
                  uploadFile(fileRef, event.target.files[0])
                  setTaskFile(ref_url)
                } else {
                  alert("Invalid File! Only image, text, audio, or video files allowed!")
                }
              }}
            />
            <label htmlFor="subtask">Add subtask:</label>
            <input
              id="subtask"
              value={subtaskDesc}
              onChange={(e) => setSubtaskDesc(e.target.value)}
            />
            <button onClick={() => {
              setSubtaskList([
                ...subtaskList,
                {
                  id: subtaskList.length,
                  name: subtaskDesc,
                  comp: false,
                },
              ]);
            }}>
              +
            </button>
            <ol>
              {subtaskList.map((subtask) => (
                <li key={subtask.id}>
                  {subtask.name}
                </li>
              ))}
            </ol>
            <button
              id="closeModal"
              onClick={() => {
                if (subtaskList != [] && taskDate != "") {
                  setTodoList([
                    ...todoList,
                    {
                      id: todoList.length,
                      title: taskName,
                      time: taskTime,
                      date: taskDate,
                      desc: taskDesc,
                      completed: false,
                      sub_tasks: subtaskList,
                      file_url: taskFile,
                      scheduled: false,
                    },
                  ]);
                } else {
                  alert("Error! Missing Information! Please try again!")
                }
              }
              }> Add </button>
            <button id="closeModal" onClick={() => {
              // Reset all the form fields or close the dialog
              setTaskName("New Task");
              setTaskTime(0);
              setTaskDesc("Task Description");
              setSubtaskDesc("");
              setSubtaskList([]);
              setTaskFile("");
              document.getElementById('modal').close();
            }}>
              Cancel
            </button>
          </dialog>

          <TodoList
            list={todoList}
            onToggle={handleToggleCompleted}
            option={sortOptionTodo}
            onToggleSubtask={handleToggleSubtask}
            onScheduled={handleScheduledTask}
          />
        </div>

        <div className="task-column">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <h2 style={{ marginLeft: 0 }}>Completed</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TextField type="search" label="Search" variant="outlined" value={searchQueryCompleted}
                onChange={filterCompleted} style={{ width: '200px' }} size="small" />
              <FormControl sx={{ m: 1, width: 200 }} size="small">
                <InputLabel id="c_sorting">Sort</InputLabel>
                <Select
                  labelId="c_sorting"
                  id="c_sorting"
                  value={sortOptionCompleted}
                  label="c_sorting"
                  onChange={(e) => setSortOptionCompleted(e.target.value)}
                >
                  <MenuItem value={0}>Sort By</MenuItem>
                  <MenuItem value={1}>Earliest created</MenuItem>
                  <MenuItem value={2}>Latest created</MenuItem>
                  <MenuItem value={3}>Earliest due</MenuItem>
                  <MenuItem value={4}>Latest due</MenuItem>
                  <MenuItem value={5}>Largest workload</MenuItem>
                  <MenuItem value={6}>Smallest workload</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <CompletedList
            list={completedList}
            onToggle={handleToggleCompleted}
            option={sortOptionCompleted}
          />
        </div>
      </div>
      <Button variant="contained" onClick={saveTasks} style={{ marginTop: '20px' }}> Save Tasks</Button>
    </ThemeProvider >
  );
}

function TodoList({ list, onToggle, option, onToggleSubtask, onScheduled }) {
  let sortedList = list;

  const [fileList, setFileList] = useState([])
  const [eventList, setEventList] = useState([])

  const fileListRef = ref(storage, "files/")
  useEffect(() => {
    listAll(fileListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setFileList((prev) => [...prev, url]);
        })
      })
    })
    get_events().then((response) => {
      setEventList(response)
    })
  }, [])

  const idAscending = [...list].sort((a, b) => a.id - b.id);
  const idDescending = [...list].sort((a, b) => b.id - a.id);
  const dueAscending = [...list].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const dueDescending = [...list].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const workAscending = [...list].sort((a, b) => a.time - b.time);
  const workDescending = [...list].sort((a, b) => b.time - a.time);

  if (option == 0) {
    sortedList = list;
  } else if (option == 1) {
    sortedList = idAscending;
  } else if (option == 2) {
    sortedList = idDescending;
  } else if (option == 3) {
    sortedList = dueAscending;
  } else if (option == 4) {
    sortedList = dueDescending;
  } else if (option == 5) {
    sortedList = workDescending;
  } else if (option == 6) {
    sortedList = workAscending;
  } else {
    sortedList = list;
  }

  const progressValue = (id) => {
    let progress = 0
    let n = 0
    sortedList.map((task) => {
      if (task.id == id) {
        if (task.sub_tasks == null) {
          n = 1
        } else {
          task.sub_tasks.map((sub_task) => {
            n = n + 1
            if (sub_task.comp == true) {
              progress = progress + 1
            }
          })
        }
      }
    })
    return progress / n
  }

  const get_events = async () => {
    return await send_request("/get_events", { calendar_id: calendarId })
  }

  const handleCreateEvent = async (task) => {
    const [year, month, day] = task.date.split("-").map(Number);
    const last_workday = new Date(year, month - 1, day - 1)
    const today = new Date()
    let daysDiff = Math.ceil(((last_workday) - (today)) / (60 * 60 * 24 * 1000) % 365)
    const new_event = {
      name: task.title,
      desc: task.desc,
      start_time: "00:00",
      end_time: "23:59",
      start_date: today,
      end_date: last_workday,
      location: "",
      calendar: "tasks",
      repetition_type: "none",
      repetition_unit: "",
      repetition_val: 1,
      selected_days: "",
      user_id: userId,
    }
    console.log(JSON.stringify(new_event))
    const response = await fetch(flaskURL + "/create_event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_event),
      credentials: "include",
    });
    if (!response.ok) {
      alert("Something went wrong, refresh your website!");
      return;
    } else {
      switch (response.status) {
        case 201:
          console.log("Event created successfully");
          alert("Event Created Successfully!")
          break;
        case 205:
          alert("Event not created!");
          break;
        case 206:
          alert("Missing information!");
          break;
      }
    }
  }

  function CircularProgressWithLabel(props) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Progress</TableCell>
          <TableCell>Task Information</TableCell>
          <TableCell>Estimated Workload</TableCell>
          <TableCell>Deadline</TableCell>
          <TableCell>Attached File</TableCell>
          <TableCell>Task Checklist</TableCell>
          <TableCell>Actions</TableCell>
          <TableCell>Complete?</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedList.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>
              <CircularProgressWithLabel variant="determinate" value={progressValue(task.id) * 100} />
            </TableCell>
            <TableCell>{task.desc}</TableCell>
            <TableCell>{task.time} hour(s)</TableCell>
            <TableCell>{task.date}</TableCell>
            <TableCell><a href={fileList[task.id]}>Get Attached File!</a></TableCell>
            <TableCell>
              {task.sub_tasks && (task.sub_tasks.map((sub_task) => (
                <p key={sub_task.id}>
                  <FormControlLabel control={<Checkbox
                    checked={sub_task.comp}
                    onChange={(e) => {
                      onToggleSubtask(task.id, sub_task.id, e.target.checked)
                    }} />} label={sub_task.name} />
                </p>
              )))}
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  const [year, month, day] = task.date.split("-").map(Number);
                  const dueDate = new Date(year, month - 1, day)
                  if (dueDate <= (new Date())) {
                    alert("Unable to schedule time for tasks past due!")
                  } else if (task.scheduled === false) {
                    handleCreateEvent(task)
                    onScheduled(task.id)
                    task.scheduled = true
                  } else {
                    alert("Task already scheduled!")
                  }
                }}
              >
                Schedule Task Time</Button>
              {/* <Button
                variant="contained"
                size="small"
                onClick={() => {
                  const [year, month, day] = task.date.split("-").map(Number);
                  let daysDiff = Math.ceil(((new Date(year, month - 1, day)) - (new Date())) / (60 * 60 * 24 * 1000) % 365)
                  console.log(daysDiff)
                }}
              >
                Print</Button> */}
            </TableCell>
            <TableCell>
              <Checkbox
                {...label}
                checked={task.completed}
                onChange={(e) => { onToggle(task.id, e.target.checked); }} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function CompletedList({ list, onToggle, option }) {
  let sortedList = list;

  const idAscending = [...list].sort((a, b) => a.id - b.id);
  const idDescending = [...list].sort((a, b) => b.id - a.id);
  const dueAscending = [...list].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const dueDescending = [...list].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const workAscending = [...list].sort((a, b) => a.time - b.time);
  const workDescending = [...list].sort((a, b) => b.time - a.time);
  const completedAscending = [...list].sort(
    (a, b) => new Date(a.completed_time) - new Date(b.completed_time)
  );
  const completedDescending = [...list].sort(
    (a, b) => new Date(b.completed_time) - new Date(a.completed_time)
  );

  if (option == 0) {
    sortedList = list;
  } else if (option == 1) {
    sortedList = idAscending;
  } else if (option == 2) {
    sortedList = idDescending;
  } else if (option == 3) {
    sortedList = dueAscending;
  } else if (option == 4) {
    sortedList = dueDescending;
  } else if (option == 5) {
    sortedList = workDescending;
  } else if (option == 6) {
    sortedList = workAscending;
  } else if (option == 7) {
    sortedList = completedAscending;
  } else if (option == 8) {
    sortedList = completedDescending;
  } else {
    sortedList = list;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Task Information</TableCell>
          <TableCell>Deadline</TableCell>
          <TableCell>Completed Time</TableCell>
          <TableCell>Completed</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedList.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.desc}</TableCell>
            <TableCell>{task.date}</TableCell>
            <TableCell>{task.completed_time}</TableCell>
            <TableCell>
              <Checkbox
                {...label}
                checked={task.completed}
                onChange={(e) => { onToggle(task.id, e.target.checked); }} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
