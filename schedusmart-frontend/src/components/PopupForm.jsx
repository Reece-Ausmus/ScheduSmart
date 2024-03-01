import React, { useState } from "react";
import "../pages/MainFrame.css";

export default function addEvent() {
  const [showPopup, setShowPopup] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [repetitionType, setRepetitionType] = useState("daily"); // Default to daily
  const [customFrequencyValue, setCustomFrequencyValue] = useState(1); // Default custom frequency
  const [customFrequencyUnit, setCustomFrequencyUnit] = useState(""); // Default custom frequency
  const [selectedDays, setSelectedDays] = useState([]); // Array to store selected days

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleEventNameChange = (e) => {
    setEventName(e.target.value);
  };

  const handleEventStartDateChange = (e) => {
    setEventStartDate(e.target.value);
  };

  const handleEventEndDateChange = (e) => {
    setEventEndDate(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleEventLocationChange = (e) => {
    setEventLocation(e.target.value);
  };

  const handleEventDescriptionChange = (e) => {
    setEventDescription(e.target.value);
  };

  const handleRepetitionChange = (type) => {
    setRepetitionType(type);
  };

  const handleCustomFrequencyValueChange = (intVal) => {
    const value = parseInt(intVal.target.value, 10);
    setCustomFrequencyValue(value);
  };

  const handleCustomFrequencyUnitChange = (e) => {
    setCustomFrequencyUnit(e.target.value);
  };

  const handleDayToggle = (day) => {
    // Toggle the selected day
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Name:", eventName);
    console.log("Event Date:", eventDate);
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);
    console.log("Event Location:", eventLocation);
    console.log("Event Description:", eventDescription);
    setEventName("");
    setEventDate("");
    setStartTime("");
    setEndTime("");
    setEventLocation("");
    setEventDescription("");
    togglePopup();
  };

  return (
    <div className="add_button">
      <button onClick={togglePopup}>Create</button>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add Event</h2>
            <form onSubmit={handleSubmit}>
              <div className="formgroup">
                <label htmlFor="eventName">Event Name:</label>
                <input
                  type="text"
                  id="eventName"
                  value={eventName}
                  onChange={handleEventNameChange}
                />
              </div>
              <div className="formgroup">
                <label htmlFor="eventStartDate">Start Date:</label>
                <input
                  type="date"
                  id="eventStartDate"
                  value={eventStartDate}
                  onChange={handleEventStartDateChange}
                />
                <label htmlFor="eventEndDate">End Date:</label>
                <input
                  type="date"
                  id="eventEndDate"
                  value={eventEndDate}
                  onChange={handleEventEndDateChange}
                />
              </div>
              <div className="formgroup">
                <label htmlFor="startTime">Start Time:</label>
                <input
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={handleStartTimeChange}
                />
                <label htmlFor="endTime">End Time:</label>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={handleEndTimeChange}
                />
              </div>
              <div className="formgroup">
                <label htmlFor="eventLocation">Event Location:</label>
                <input
                  type="text"
                  id="eventLocation"
                  value={eventLocation}
                  onChange={handleEventLocationChange}
                />
              </div>
              <div className="formgroup">
                <label htmlFor="eventDescription">Event Description:</label>
                <textarea
                  id="eventDescription"
                  value={eventDescription}
                  onChange={handleEventDescriptionChange}
                  rows="4"
                  cols="50"
                />
              </div>
              <div className="event-repetition-form">
                <h2>Event Repetition</h2>
                <div className="repetition-options">
                  <button onClick={() => handleRepetitionChange("daily")}>
                    Daily
                  </button>
                  <button onClick={() => handleRepetitionChange("weekly")}>
                    Weekly
                  </button>
                  <button onClick={() => handleRepetitionChange("monthly")}>
                    Monthly
                  </button>
                  <button onClick={() => handleRepetitionChange("yearly")}>
                    Yearly
                  </button>
                  <button onClick={() => handleRepetitionChange("custom")}>
                    Custom
                  </button>
                </div>
                {repetitionType === "custom" && (
                  <div className="custom-repetition">
                    <label htmlFor="customFrequency">Repeat every</label>
                    <input
                      type="number"
                      id="customFrequencyValue"
                      value={customFrequencyValue}
                      onChange={handleCustomFrequencyValueChange}
                      min={1}
                    />
                    <select
                      id="customFrequencyUnit"
                      value={customFrequencyUnit}
                      onChange={handleCustomFrequencyUnitChange}
                    >
                      <option value="days">days</option>
                      <option value="weeks">weeks</option>
                      <option value="months">months</option>
                      <option value="years">years</option>
                    </select>
                    {customFrequencyUnit === "weeks" && (
                      <div className="day-selector">
                        <p>Select specific days:</p>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedDays.includes("sun")}
                            onChange={() => handleDayToggle("sun")}
                          />
                          Sunday
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedDays.includes("mon")}
                            onChange={() => handleDayToggle("mon")}
                          />
                          Monday
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedDays.includes("tues")}
                            onChange={() => handleDayToggle("tues")}
                          />
                          Tuesday
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedDays.includes("wed")}
                            onChange={() => handleDayToggle("wed")}
                          />
                          Wednesday
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedDays.includes("thur")}
                            onChange={() => handleDayToggle("thur")}
                          />
                          Thursday
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedDays.includes("fri")}
                            onChange={() => handleDayToggle("fri")}
                          />
                          Friday
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedDays.includes("sat")}
                            onChange={() => handleDayToggle("sat")}
                          />
                          Saturday
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button className="formbutton fb1" type="submit">
                Add
              </button>
              <button className="formbutton fb2" onClick={togglePopup}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
