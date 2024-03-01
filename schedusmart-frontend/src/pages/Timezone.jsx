import React, { useState } from "react";
import { DateTime } from "luxon";

const timezoneOptions = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
];

export default function TimezoneConverter() {
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  const handleTimezoneChange = (event) => {
    const newTimezone = event.target.value;
    setSelectedTimezone(newTimezone);
    setCurrentTime(getCurrentTime(newTimezone));
  };

  const getCurrentTime = (timezone) => {
    try {
      const dt = DateTime.now().setZone(timezone);
      return dt.toLocaleString(DateTime.TIME_SIMPLE);
    } catch (error) {
      console.error("Error getting current time:", error);
      return "Unknown Time";
    }
  };

  return (
    <div>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <select value={selectedTimezone} onChange={handleTimezoneChange}>
          <option value="" disabled>
            Select Timezone
          </option>
          {timezoneOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p style={{ marginLeft: "10px" }}>Current Time: {currentTime}</p>
      </div>
    </div>
  );
}
