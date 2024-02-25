import React, { useState } from 'react';
// CSS file is not created yet
import './TaskManager.css';

// Define the Flask API URL
const flaskURL = "http://127.0.0.1:5000";

export default function TaskManager() {
  // State variables for managing tasks
  let nextId = 0;
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Task creator pop-up
  const modal = document.querySelector("#modal");
  const openModal = document.querySelector("#openModal");
  const closeModal = document.querySelector("#closeModal");

  if (modal) {
    openModal && openModal.addEventListener("click", () => modal.showModal());

    closeModal && closeModal.addEventListener("click", () => modal.close());
  }
  

  // Function to add a new task
  const addTask = () => {
    // add task
  };

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

  return (
    <>
      <button id="openModal">Add Task</button>
      <dialog id="modal" class="dialog">
        <button id="closeModal" class= "dialog-close-btn">Close</button>
        <p>Hello</p>
        <input
        value={task}
        onChange={e => setTask(e.target.value)}
        />
        <button onClick={() => {
          taskList.push({
            id: nextId++,
            name: task,
          });
        }}>Create task</button>
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
    </>  
  );
}
/*
<button id="openModal">Add Task</button>
      <dialog id="modal">
        <p>Task</p>
        <button id="closeModal" class="dialog-close-btn">Add Task</button>
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
      <div className="task-list">
        {
          // Render the list of tasks 
        }
        {tasks.map(task => (
          <div key={task.id} className="task">
            {
              // Display task details 
            }
          </div>
        ))}
      </div>
*/