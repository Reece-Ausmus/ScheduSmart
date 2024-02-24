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
          <Route path="/calendar" element={<MainFrame/>}/>
          <Route path="*" element={<NoPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}