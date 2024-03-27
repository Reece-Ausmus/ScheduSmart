import React from "react";
import "./Popup.css";

export default function AddBreakPopup({
  breakName,
  handleBreakNameChange,
  breakStartDate,
  handleBreakStartDateChange,
  breakEndDate,
  handleBreakEndDateChange,
  handleCreateBreak,
  handleCancelBreak
}) {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Add Break</h2>
        <div>
          <div className="formgroup">
            <label htmlFor="breakName">Break Name:</label>
            <input
              type="text"
              id="breakName"
              value={breakName}
              onChange={handleBreakNameChange}
            />
          </div>

          <div className="formgroup">
            <label htmlFor="breakStartDate">Start Date:</label>
            <input
              type="date"
              id="breakStartDate"
              value={breakStartDate}
              onChange={handleBreakStartDateChange}
            />
            <label htmlFor="breakEndDate">End Date:</label>
            <input
              type="date"
              id="breakEndDate"
              value={breakEndDate}
              onChange={handleBreakEndDateChange}
            />
          </div>
          <button className="formbutton fb1" onClick={handleCreateBreak}>
            Add
          </button>
          <button className="formbutton fb2" onClick={handleCancelBreak}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
