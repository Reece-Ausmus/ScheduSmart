import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Welcome from './pages/Welcome'
import Settings from './pages/Settings'
import Dashboard from './pages/Dashboard'
import Signout from './pages/Signout'
import NoPage from './pages/NoPage'
import Createaccount from './pages/Createaccount'
import MainFrame from './pages/MainFrame'
import SignIn from './pages/SignIn'
import TaskManager from './pages/TaskManager'
import DragAndDrop from './pages/MainFrameWithDragandDrug'
import Reminder from './pages/Reminder'
import Notes from './pages/Notes'
import FileUpload from './pages/FileUpload'
import SetupCourses from './pages/SetupCourses'
import Habits from './pages/Habits'
import ResetPassword from './pages/ResetPassword'
import Friendlist from'./pages/Friendlist'

// to run program 
// Open new terminal
// cd into ScheduSmart\schedusmart-frontend
// run command: s
//    npm run dev 
// save program to update to local server

// to create new page
// create new .jsx file in pages
// <Route path="/new_page_name" element={<NewPage/>} />

// Ensure path to NoPage remains at the bottom 

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Welcome/>} />
          <Route path="/welcome" element={<Welcome/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/signout" element={<Signout/>} />
          <Route path="/createaccount" element={<Createaccount/>} />
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/resetpassword" element={<ResetPassword/>} />
          <Route path="/calendar" element={<MainFrame/>}/>
          <Route path="/taskmanager" element={<TaskManager/>}/>
          <Route path="/draganddrop" element={<DragAndDrop/>}/>
          <Route path="/notes" element={<Notes/>}/>
          <Route path="/Habits" element={<Habits/>}/>
          <Route path="/setupcourses" element={<SetupCourses/>}/>
          <Route path="*" element={<NoPage/>} />
          <Route path="/reminder" element={<Reminder/>} />
          <Route path="/friendlist" element={<Friendlist/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}