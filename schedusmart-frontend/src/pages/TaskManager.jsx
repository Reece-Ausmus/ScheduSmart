import React, { useState, useEffect } from "react";
import "./TaskManager.css";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import FileUpload from "./FileUpload";

// Define the Flask API URL
const flaskURL = "http://127.0.0.1:5000";

// user_id to get user info
const userId = sessionStorage.getItem("user_id");


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
    sub_tasks: [{id: 0, name: "Question 1", comp: true}, 
                {id: 1, name: "Question 2", comp: true}, 
                {id: 2, name: "Question 3", comp: false},], 
  },
  {
    id: 1,
    title: "Sprint Planning",
    time: 2,
    date: "2024-09-23",
    desc: "Speak with team coordinator",
    completed: false,
    completed_time: null, 
    sub_tasks: [{id: 0, name: "Backlog", comp: false}, 
                {id: 1, name: "User Stories", comp: false}, 
                {id: 2, name: "Acceptable Criteria", comp: false},], 
  },
  {
    id: 2,
    title: "Midterm Study",
    time: 5,
    date: "2059-09-23",
    desc: "Look at slides lol",
    completed: false,
    completed_time: null,
    sub_tasks: [{id: 0, name: "Chapter 1", comp: true}, 
                {id: 1, name: "Chapter 2", comp: false}, 
                {id: 2, name: "Chapter 3", comp: false},], 
  },
];
let nextId = initialList.length;

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
            setTodoList(responseData.task_list)
            nextId = todoList.length;
          } 
          console.log(userId);
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
  }, []);

  // select sort option
  const [sortOptionTodo, setSortOptionTodo] = useState(0);
  const [sortOptionCompleted, setSortOptionCompleted] = useState(0);

  // used to hold data for tasks
  const [taskName, setTaskName] = useState("");
  const [taskTime, setTaskTime] = useState(0);
  const [taskDate, setTaskDate] = useState();
  const [taskDesc, setTaskDesc] = useState("");
  const [todoList, setTodoList] = useState(initialList);
  const [completedList, setCompletedList] = useState([]);
  const [file, setFile] = useState();

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

  function handleToggleSubtask(id, sub_id, checked){
    let mapped = todoList.map((task) => {
      if (task.id == id) {
        let sub_mapped = task.sub_tasks.map((sub_task) => {
          return sub_task.id == sub_id ? {...sub_task, comp: checked} : {...sub_task};
        })
        return {...task, sub_tasks: sub_mapped}
      } else {
        return {...task};
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

  return (
    <>
      <div>
        <FileUpload/>
        <h1>Task List</h1>
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
        >
          <option value="pdf">PDF</option>
          <option value="csv">CSV</option>
        </select>
        <button onClick={handleExport}>
          Export as {selectedFormat.toUpperCase()}
        </button>
        <button
          id="openModal"
          onClick={() => {
            setTaskName("New Task");
            setTaskTime(0);
            setTaskDesc("Task Description");
          }}
        >
          Add Task
        </button>
        <button
        onClick={() => {
        window.location.href = "/calendar";
        }}
        >Calendar</button>
        </div>
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
          <label htmlFor="file">File:</label>
          <input 
            id="file"
            type="file" 
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            id="closeModal"
            onClick={() => {
              setTodoList([
                ...todoList,
                {
                id: nextId++,
                title: taskName,
                time: taskTime,
                date: taskDate,
                desc: taskDesc,
                completed: false,
              },
              ]);
            }}
          >
            Add
          </button>
      </dialog>
      <div className="task-columns-container">
        <div className="task-column">
          <h2>To Do</h2>
          <input
            type="search"
            value={searchQueryTodo}
            onChange={filterTodo}
            placeholder="Search"
          />
          <select
            value={sortOptionTodo}
            onChange={(e) => setSortOptionTodo(e.target.value)}
          >
            <option value="0">Sort By</option>
            <option value="1">Earliest created</option>
            <option value="2">Latest created</option>
            <option value="3">Earliest due</option>
            <option value="4">Latest due</option>
            <option value="5">Largest workload</option>
            <option value="6">Smallest workload</option>
          </select>
          <TodoList
            list={todoList}
            onToggle={handleToggleCompleted}
            option={sortOptionTodo}
            onToggleSubtask={handleToggleSubtask}
          />
        </div>
        <div className="task-column">
          <h2>Completed</h2>
          <input
            type="search"
            value={searchQueryCompleted}
            onChange={filterCompleted}
            placeholder="Search"
          />
          <select
            value={sortOptionCompleted}
            onChange={(e) => setSortOptionCompleted(e.target.value)}
          >
            <option value="0">Sort By</option>
            <option value="1">Earliest created</option>
            <option value="2">Latest created</option>
            <option value="3">Earliest due</option>
            <option value="4">Latest due</option>
            <option value="5">Largest workload</option>
            <option value="6">Smallest workload</option>
            <option value="7">Earliest completed</option>
            <option value="8">Latest completed</option>
          </select>
          <CompletedList
            list={completedList}
            onToggle={handleToggleCompleted}
            option={sortOptionCompleted}
          />
        </div>
      </div>
      <button
        onClick={async () => {
            const info = {
              user_id: userId,
              task_list: todoList 
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
        }
      >
        Save Tasks
      </button>
    </>
  );
}

function TodoList({ list, onToggle, option, onToggleSubtask }) {
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
        task.sub_tasks.map((sub_task) => {
          n = n + 1
          if (sub_task.comp == true) {
            progress = progress + 1
          }
        })
      }
    })
    return progress / n
  }

  return (
    <div>
      {sortedList.map((task) => (
        <div className="post" key={task.id}>
          <h3>{task.title}</h3>
          <progress value={progressValue(task.id)}/>
          <p>{task.desc}</p>
          <p>Estimated Workload: {task.time} hour(s)</p>
          <p>Deadline: {task.date}</p>
          <p>File: {task.file}</p>
          <h4>Task Checklist</h4>
          {task.sub_tasks.map((sub_task) => (
              <p key={sub_task.id}>
                <input
                  type="checkbox"
                  checked={sub_task.comp}
                  onChange={(e) => {
                    onToggleSubtask(task.id, sub_task.id, e.target.checked)
                  }}
                />
                {sub_task.name} 
              </p>
          ))}
          <h4>Complete?</h4>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => {
              onToggle(task.id, e.target.checked);
            }}
          />
        </div>
      ))}
    </div>
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
    <div>
      {sortedList.map((task) => (
        <div className="post" key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.desc}</p>
          <p>Estimated Workload: {task.time} hour(s)</p>
          <p>Deadline: {task.date}</p>
          <p>Completed: {task.completed_time}</p>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => {
              onToggle(task.id, e.target.checked);
            }}
          />
        </div>
      ))}
    </div>
  );
}
