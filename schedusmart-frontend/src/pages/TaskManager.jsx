import React, { useState } from 'react';
// CSS file is not created yet
import './TaskManager.css';

// Define the Flask API URL
const flaskURL = "http://127.0.0.1:5000";

export default function TaskManager() {
  // State variables for managing tasks
  const [tasks, setTasks] = useState([]);
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
      <dialog id="modal">
        <p>
          Task:<input 
            type="text"
            placeholder="Input task name"
            value={tasks}
            onChange={addTask}
          />
        </p>
        <button id="closeModal">Close this modal</button>
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
    </>

    /*  
    <div className="task-manager-container">
      <div className="task-manager-header">
        <button id="openModal">Add Task</button>

        <dialog id="modal">
          <p>Add Task! Click the button below to add a task.</p>
          <button id="closeModal">Create Task</button>
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
      </div>
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
    </div>
    */
  );
}
