import React, { useState } from 'react';
import "./TaskManager.css"

// Define the Flask API URL
const flaskURL = "http://127.0.0.1:5000";

let nextId = 1;
let str = "";
const initialList = [
  { id: 0, title: 'Task Example', time: 4, date: "2003-09-23", seen: false },
];

export default function TaskManager() {
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState(0);
  const [taskDate, setTaskDate] = useState();
  const [myList, setMyList] = useState(initialList);

  // Task creator pop-up
  const modal = document.querySelector("#modal");
  const openModal = document.querySelector("#openModal");
  const closeModal = document.querySelector("#closeModal");

  if (modal) {
    openModal && openModal.addEventListener("click", () => modal.showModal());

    closeModal && closeModal.addEventListener("click", () => modal.close());
  }

  // handle list making
  function handleToggleMyList(listId, nextSeen) {
    const myNextList = [...myList];
    const list = myNextList.find(
      l => l.id === listId
    );
    list.seen = nextSeen;
    setMyList(myNextList);
  }

  return (
    <>
      <div>
        <h1>Task List</h1>
        <button id="openModal" onClick={() => {
          setTaskName("")
          setTaskTime(0)
        }}>Add Task</button>
      </div>
      <dialog id="modal">
        <label for="name">Task Name:</label>
        <input
        id="name"
        value={taskName}
        onChange={e => setTaskName(e.target.value)}
        />
        <label for="time">Workload:</label>
        <input 
        type="number"
        id="time"
        min="1"
        value={taskTime}
        onChange={e => setTaskTime(e.target.value)}
        />
        <label for="date">Due Date:</label>
        <input
        type="date"
        id="date"
        value={taskDate}
        onChange={e => setTaskDate(e.target.value)}
        />
        <button id="closeModal" onClick={() => {
          setMyList([
            ...myList,
            {id: nextId, title: taskName, time: taskTime, date: taskDate, seen:false}
          ]);
          nextId = nextId + 1
        }}>Add</button>
      </dialog>
      <ItemList
        list={myList}
        onToggle={handleToggleMyList} 
      />
    </>
  );
}

function ItemList({ list, onToggle }) {
  return (
    <ul>
      {list.map(task => (
        <li key={task.id}>
          <label>
            | {task.title} | Time to Complete: {task.time} hours | Due Date: {task.date}
            <input
              type="checkbox"
              checked={task.seen}
              onChange={e => {
                onToggle(
                  task.id,
                  e.target.checked
                );
              }}
            />
          </label>
        </li>
      ))}
    </ul>
  );
}

/*

<button id="closeModal" class= "dialog-close-btn">Close</button>

// State variables for managing tasks
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // Implement logic to filter tasks based on search query
  };

  // Function to handle sort option change
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    // Implement logic to sort tasks based on selected option
  };


// Task creator pop-up
const modal = document.querySelector("#modal");
const openModal = document.querySelector("#openModal");
const closeModal = document.querySelector("#closeModal");

if (modal) {
  openModal && openModal.addEventListener("click", () => modal.showModal());

  closeModal && closeModal.addEventListener("click", () => modal.close());
}
<button id="openModal">Add Task</button>
      <dialog id="modal" class="dialog">
        <button id="closeModal" class= "dialog-close-btn">Close</button>
        <p>Hello</p>
      </dialog>

      </dialog>
      <input 
          type="text" 
          placeholder="Search tasks..." 
          value={searchQuery} 
          onChange={handleSearchChange} 
      />
      <select value={sortOption} onChange={handleSortChange}>
        <option value="">Sort By</option>
        {
          // Add sorting options 
        } 
      </select>
      <u1>
        {taskList.map(task_i => (
          <li key={task_i.id}>{task_i.name}</li>
        ))}
      </u1>
*/