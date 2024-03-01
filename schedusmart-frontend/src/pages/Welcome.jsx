import React from "react";
import Header from "../components/Header";
import { Navigate } from "react-router-dom";

export default function Welcome() {
  /*const [goToDash, setGoToDash] = React.useState(false)

    if (goToDash) {
        return(
            <>
            <Navigate to="/dashboard" />
            </>
        );
    }*/

  return (
    <>
      <Header />
      <h2>Welcome!</h2>
      <button
        onClick={() => {
          window.location.href = "/signin";
        }}
      >
        Sign-in!
      </button>
      <button
        onClick={() => {
          window.location.href = "/createaccount";
        }}
      >
        Create an account!
      </button>
      <button
        onClick={() => {
          window.location.href = "/dashboard";
        }}
      >
        Dashboard
      </button>
      <button
        onClick={() => {
          window.location.href = "/taskmanager";
        }}
      >
        Task Manager
      </button>
      <button
        onClick={() => {
          window.location.href = "/calendar";
        }}
      >
        Calendar
      </button>
      <button
        onClick={() => {
          window.location.href = "/settings";
        }}
      >
        Settings
      </button>
    </>
  );
}
