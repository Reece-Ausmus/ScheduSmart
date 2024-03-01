import Header from "../components/Header";
import React from "react";
import { Navigate } from "react-router-dom";

export default function Settings() {
  return (
    <>
      <Header />
      <h2>Error 404: Not Found</h2>
      <button
        onClick={() => {
          window.location.href = "/welcome";
        }}
      >
        Go back to welcome screen
      </button>
    </>
  );
}
