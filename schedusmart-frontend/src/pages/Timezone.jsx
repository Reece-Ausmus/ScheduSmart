import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import languageLibrary from "../components/language.json";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const flaskURL = "http://127.0.0.1:5000"; // Update with your backend URL
const userId = sessionStorage.getItem("user_id");



export default function TimezoneConverter(lang) {
  let language = 0;
  if (lang != undefined && lang != null) {
    language = lang;
  }

  let languageData = languageLibrary[language][0].timeZone;

  const timezoneOptions = [
    { value: "America/New_York", label: languageData.ET },
    { value: "America/Chicago", label: languageData.CT },
    { value: "America/Denver", label: languageData.MT },
    { value: "America/Los_Angeles", label: languageData.PT },
  ];

  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  const fetchUserTimezone = async () => {
    try {
      const response = await fetch(flaskURL + "/user_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      if (!response.ok) {
        console.error("Failed to fetch user data");
        return;
      }

      const userData = await response.json();

      // Log user data to the console
      //console.log(userData);
      //console.log("Timezone:", userData.timezoneTest);

      // Check if timezone field is populated
      //const userTimezone = userData.timezone || "No timezone set";
      const userTimezone = userData.timezone || "";

      setSelectedTimezone(userTimezone);
      setCurrentTime(getCurrentTime(userTimezone));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserTimezone();
  }, []);

  const handleTimezoneChange = async (event) => {
    const newTimezone = event.target.value;
    setSelectedTimezone(newTimezone);
    setCurrentTime(getCurrentTime(newTimezone));

    // Send updated timezone to the backend
    try {
      const response = await fetch(flaskURL + "/update_account_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          timezone: newTimezone,
        }),
      });

      if (!response.ok) {
        switch (response.status) {
          case 500:
            alert("Failed to update timezone in the database");
            break;
          // Any invalid input attempts
          default:
            alert("An error occurred while updating timezone");
            break;
        }
        return;
      }

      // Succesfull response message, will comment out in final production
      const responseData = await response.json();
      alert("Timezone updated successfully: " + responseData.message);
    } catch (error) {
      alert("An error occurred while updating timezone");
    }
  };

  const getCurrentTime = (timezone) => {
    try {
      if (!timezone) {
        // If timezone is not provided, default to UTC
        const dt = DateTime.now().setZone("UTC");
        return dt.toLocaleString(DateTime.TIME_SIMPLE);
      }

      const dt = DateTime.now().setZone(timezone);
      return dt.toLocaleString(DateTime.TIME_SIMPLE);
    } catch (error) {
      console.error("Error getting current time:", error);
      return "Invalid DateTime";
    }
  };

  return (
    <div>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <Typography variant="body1" style={{ marginLeft: "10px" }}>
          {languageData.currentTime}{currentTime}
        </Typography>
        <Typography variant="body1" style={{ marginLeft: "10px" }}>
          {languageData.timeZone}
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <Select
            labelId="timezone-select-label"
            id="timezone-select"
            value={selectedTimezone}
            onChange={handleTimezoneChange}
          >
            <MenuItem value="" disabled>
              {languageData.selectTimeZone}
            </MenuItem>
            {timezoneOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
