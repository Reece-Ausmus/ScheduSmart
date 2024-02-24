import React, { useState } from 'react';
// CSS file is not created yet
// import './TaskManager.css';

// Define the Flask API URL
const flaskURL = "http://127.0.0.1:5000";

export default function TaskManager() {
  // State variables for managing tasks
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Function to add a new task
  const addTask = () => {
    // Implement logic to add a new task
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
    <div className="task-manager-container">
      <div className="task-manager-header">
        <button onClick={addTask}>Add Task</button>
        <input 
          type="text" 
          placeholder="Search tasks..." 
          value={searchQuery} 
          onChange={handleSearchChange} 
        />
        <select value={sortOption} onChange={handleSortChange}>
          <option value="">Sort By</option>
          {/* Add sorting options */}
        </select>
      </div>
      <div className="task-list">
        {/* Render the list of tasks */}
        {tasks.map(task => (
          <div key={task.id} className="task">
            {/* Display task details */}
          </div>
        ))}
      </div>
    </div>
  );
}
