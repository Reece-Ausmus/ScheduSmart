import React, { useState } from "react";
import "./Settings.css";
const flaskURL = "http://127.0.0.1:5000";

export default function Reminder() {
  const handleReminder = async (event) => {
    event.preventDefault();
  };
  const [remindersOn, setRemindersOn] = useState(true);
  const toggleReminders = () => {
    setRemindersOn((prevState) => !prevState);
  };

  const [reminderOptions, setReminderOptions] = useState([
    { id: 1, label: "Browser notification", checked: true },
    { id: 2, label: "Email", checked: false },
    { id: 3, label: "Mobile notification", checked: false },
  ]);

  const [timeOptions] = useState([
    { id: 5, value: 5 },
    { id: 10, value: 10 },
    { id: 15, value: 15 },
    { id: 30, value: 30 },
    { id: 60, value: 60 },
  ]);

  const [selectedTimeOption, setSelectedTimeOption] = useState(10);

  const handleCheckboxChange = (id) => {
    const updatedOptions = reminderOptions.map((option) =>
      option.id === id ? { ...option, checked: !option.checked } : option
    );
    setReminderOptions(updatedOptions);
  };

  const handleTimeSelectChange = (e) => {
    setSelectedTimeOption(parseInt(e.target.value));
  };

  return (
    <div>
      <h2 className="reminder_header">Reminder Settings</h2>
      <div>
        <button onClick={toggleReminders}>
          {remindersOn ? "Turn Off Reminders" : "Turn On Reminders"}
        </button>
      </div>
      <div>
        <p className="text">How do you want to be notified?</p>
        {reminderOptions.map((option) => (
          <label key={option.id} className="checkbox-container">
            {option.label}
            <input
              type="checkbox"
              checked={option.checked}
              onChange={() => handleCheckboxChange(option.id)}
            />
            <span className="checkmark"></span>
          </label>
        ))}
      </div>
      <div className="reminder-settings">
        <p className="text">Remind me:</p>
        <select value={selectedTimeOption} onChange={handleTimeSelectChange}>
          {timeOptions.map((option) => (
            <option key={option.id} value={option.value}>
              {option.value} minutes before
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
