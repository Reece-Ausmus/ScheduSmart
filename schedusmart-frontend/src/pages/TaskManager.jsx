import React, { useState } from "react";
import "./TaskManager.css";
import { jsPDF } from "jspdf";

// Define the Flask API URL
const flaskURL = "http://127.0.0.1:5000";

const initialList = [
  {
    id: 0,
    title: "Homework 2",
    time: 4,
    date: "2024-02-25",
    desc: "Complete design document and sumbit",
    completed: false,
    completed_time: null,
  },
  {
    id: 1,
    title: "Sprint Planning",
    time: 2,
    date: "2024-09-23",
    desc: "Speak with team coordinator",
    completed: false,
    completed_time: null,
  },
  {
    id: 2,
    title: "Midterm Study",
    time: 5,
    date: "2059-09-23",
    desc: "Look at slides lol",
    completed: false,
    completed_time: null,
  },
];
let nextId = initialList.length;

export default function TaskManager() {
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



  const [isDownloaded, setIsDownloaded] = useState(false);
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
      doc.text(task.title, 15, y);
      y += lineHeight;

      doc.text(task.desc, 15, y);
      y += lineHeight;
      doc.text(`${task.time} hour(s) - ${task.date}`, 15, y);
      y += lineHeight;
    });

    // Trigger download without opening the document in a new tab
    doc.save("task-list.pdf");
    setIsDownloaded(true);
  };

  return (
    <>
      <div>
        <h1>Task List</h1>
        <button onClick={generatePDF}>Export as PDF</button>
        {isDownloaded && <p>Your PDF has been downloaded!</p>}
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
      </div>
      <dialog id="modal">
        <label for="name">Task Name:</label>
        <input
          id="name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <label for="time">Workload:</label>
        <input
          type="number"
          id="time"
          min="1"
          value={taskTime}
          onChange={(e) => setTaskTime(e.target.value)}
        />
        <label for="date">Due Date:</label>
        <input
          type="date"
          id="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
        />
        <label for="desc">Description:</label>
        <input
          id="desc"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
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
    </>
  );
}

function TodoList({ list, onToggle, option }) {
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

  return (
    <div>
      {sortedList.map((task) => (
        <div className="post" key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.desc}</p>
          <p>Estimated Workload: {task.time} hour(s)</p>
          <p>Deadline: {task.date}</p>
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
