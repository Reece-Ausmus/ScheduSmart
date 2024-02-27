import React, { useState } from 'react';
import "./TaskManager.css"

// Define the Flask API URL
const flaskURL = "http://127.0.0.1:5000";

// let str = "";
const initialList = [
  { id: 0, title: 'Homework 2', time: 4, date: "2024-02-25", desc: "Complete design document and sumbit", completed: false },
  { id: 1, title: 'Sprint Planning', time: 2, date: "2024-09-23", desc: "Speak with team coordinator", completed: false },
  { id: 2, title: 'Midterm Study', time: 5, date: "2059-09-23", desc: "Look at slides lol", completed: false },
];
let nextId = initialList.length

export default function TaskManager() {
  // select sort option
  const [sortOption, setSortOption] = useState(0);

  // used to hold data for tasks
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState(0);
  const [taskDate, setTaskDate] = useState();
  const [taskDesc, setTaskDesc] = useState('');
  const [myList, setMyList] = useState(initialList);
  const [completedList, setCompletedList] = useState([]);

  // Task creator pop-up
  const modal = document.querySelector("#modal");
  const openModal = document.querySelector("#openModal");
  const closeModal = document.querySelector("#closeModal");

  if (modal) {
    openModal && openModal.addEventListener("click", () => modal.showModal());

    closeModal && closeModal.addEventListener("click", () => modal.close());
  }

  // handle task list making
  function handleToggleCompleted(taskID, completedStatus) {
    let taskToUpdate = myList.find(task => task.id === taskID);
    if (!taskToUpdate) {
      taskToUpdate = completedList.find(task => task.id === taskID);
    }
    if (!taskToUpdate) {
      return;
    }
    const updatedTask = { ...taskToUpdate, completed: completedStatus}
    if (completedStatus) {
      setCompletedList(completedList => [...completedList, updatedTask]);
      setMyList(myList => myList.filter(task => task.id !== taskID));
    } else {
      setMyList(myList => [...myList, updatedTask]);
      setCompletedList(completedList => completedList.filter(task => task.id !== taskID));
    }
  }

  // search list
  const [searchQuery, setSearchQuery] = useState('');
  const [foundList, setFoundList] = useState(myList);

  // filter list
  const filter = (e) => {
    const keyword = e.target.value;

    if (keyword !== '') {
      const results = myList.filter((task) => {
        return task.title.toLowerCase().includes(keyword.toLowerCase()) || task.desc.toLowerCase().includes(keyword.toLowerCase());
      });
      setFoundList(results)
    } else {
      setFoundList(myList)
    }

    setSearchQuery(keyword)
  }

  return (
    <>
      <div>
        <h1>Task List</h1>
        <button id="openModal" onClick={() => {
          setTaskName("New Task")
          setTaskTime(0)
          setTaskDesc("Task Description")
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
        <label for="desc">Description:</label>
        <input
        id="desc"
        value={taskDesc}
        onChange={e => setTaskDesc(e.target.value)}
        />
        <button id="closeModal" onClick={() => {
          setMyList([
            ...myList,
            {id: nextId++, title: taskName, time: taskTime, date: taskDate, desc: taskDesc, completed:false}
          ]);
        }}>Add</button>
      </dialog>
      <input
      type="search"
      value={searchQuery}
      onChange={filter}
      placeholder="Search"
      />
      <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
        <option value="0">Sort By</option>
        <option value="1">Earliest created</option>
        <option value="2">Latest created</option>
        <option value="3">Earliest due</option>
        <option value="4">Latest due</option>
        <option value="5">Largest workload</option>
        <option value="6">Smallest workload</option>
      </select>
      {/*<ItemList
        list={foundList}
        onToggle={handleToggleCompleted} 
      option={sortOption}
      />*/}
      {/*<div className="task-columns">
        <div className="task-column">
          <h2>To Do</h2>
          <ItemList
            list={myList}
            onToggle={handleToggleCompleted} 
            option={sortOption}
          />
        </div>
        <div className="task-column">
          <h2>Completed</h2>
          <CompletedList list={completedList} />
        </div>
      </div>*/}
      <div className="task-columns-container">
        <div className="task-column">
          <h2>To Do</h2>
          <TodoList
            list={myList}
            onToggle={handleToggleCompleted} 
            option={sortOption}
          />
        </div>
        <div className="task-column">
          <h2>Completed</h2>
          <CompletedList
            list={completedList}
            onToggle={handleToggleCompleted}
          />
        </div>
      </div>
    </>
  );
}

function TodoList({ list, onToggle, option}) {

  let sortedList = list;

  const idAscending = [...list].sort((a, b) => a.id - b.id)
  const idDescending = [...list].sort((a, b) => b.id - a.id);
  const dueAscending = [...list].sort((a, b) => new Date(a.date) - new Date(b.date))
  const dueDescending = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  const workAscending = [...list].sort((a, b) => a.time - b.time)
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
      {sortedList.map(task => (
        <div className="post" key={task.id} >
          <h3>{task.title}</h3>
          <p>{task.desc}</p>
          <p>Estimated Workload: {task.time}</p>
          <p>Deadline: {task.date}</p>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={e => {
              onToggle(
                task.id,
                e.target.checked
              );
            }}
          />
        </div>
      ))}
    </div>
  );
}

function CompletedList({ list, onToggle }) {
  return (
    <div>
      {list.map(task => (
        <div className="post" key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.desc}</p>
          <p>Estimated Workload: {task.time}</p>
          <p>Deadline: {task.date}</p>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={e => {
              onToggle(
                task.id,
                e.target.checked
              );
            }}
          />
        </div>
      ))}
    </div>
  );
}