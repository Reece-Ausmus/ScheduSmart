import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Welcome from './pages/Welcome'
import Settings from './pages/Settings'
import Dashboard from './pages/Dashboard'
import NoPage from './pages/NoPage'

// to run program 
// Open new terminal
// cd into ScheduSmart\schedusmart-frontend
// run command: 
//    npm run dev 
// save program to update to local server

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Welcome/>} />
          <Route path="/welcome" element={<Welcome/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="*" element={<NoPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}