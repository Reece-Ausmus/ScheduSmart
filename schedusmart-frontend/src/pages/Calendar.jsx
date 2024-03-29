// This document is used for the components of dashboard
import React from "react";
import "./MainFrame.css";
import { useState, useRef, useEffect } from "react";
import { flaskURL, user_id } from "../config";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import send_request from "./requester";
import moment from "moment";

function firstDaySeeker(today) {
  let date = today.getDate();
  const day = today.getDay();
  date = date % 7;
  date = day - date + 1;
  date < 0 ? (date += 7) : date;
  return 1 - date;
}

function printerForMode3(date, lastDayInt) {
  return date > 0 && date <= lastDayInt ? date : null;
}

export default function Calendar(selectMode, e, d) {
  // BEGIN UPDATE EVENT STUFF

  const [eventId, setEventId] = useState("");
  const [showUpdateEventPopup, setShowUpdateEventPopup] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventRepetitionType, setEventRepetitionType] = useState("none");
  const [eventCustomFrequencyValue, setEventCustomFrequencyValue] = useState(1);
  const [eventCustomFrequencyUnit, setEventCustomFrequencyUnit] = useState("");
  const [eventSelectedDays, setEventSelectedDays] = useState([]); // Array to store selected days
  const [LocationSettings, setLocationSettings] = useState("text");

  const toggleShowUpdateEventPopup = () => {
    setShowUpdateEventPopup(!showUpdateEventPopup);
  };

  const renderLocationInput = () => {
    if (LocationSettings === "text") {
      return (
        <input
          type="text"
          id="eventLocation"
          value={eventLocation}
          onChange={handleEventLocationChange}
        />
      );
    } else if (LocationSettings === "map") {
      return (
        <div>
          <Map />
        </div>
      );
    }
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

  const handleEventStartTimeChange = (e) => {
    setEventStartTime(e.target.value);
  };

  const handleEventEndTimeChange = (e) => {
    setEventEndTime(e.target.value);
  };

  const handleEventLocationChange = (e) => {
    setEventLocation(e.target.value);
  };

  const handleEventDescriptionChange = (e) => {
    setEventDescription(e.target.value);
  };

  const handleEventRepetitionChange = (type) => {
    setEventRepetitionType(type);
  };

  const handleEventCustomFrequencyValueChange = (intVal) => {
    const value = parseInt(intVal.target.value, 10);
    setEventCustomFrequencyValue(value);
  };

  const handleEventCustomFrequencyUnitChange = (e) => {
    setEventCustomFrequencyUnit(e.target.value);
  };

  const handleEventDayToggle = (day) => {
    // Toggle the selected day
    setEventSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleUpdateEvent = async () => {
    const new_event = {
      name: eventName,
      desc: eventDescription,
      start_time: eventStartTime,
      end_time: eventEndTime,
      start_date: eventStartDate,
      end_date: eventEndDate,
      location: eventLocation,
      repetition_type: eventRepetitionType,
      repetition_unit: eventCustomFrequencyUnit,
      repetition_val: eventCustomFrequencyValue,
      selected_days: eventSelectedDays,
      user_id: user_id,
      type: eventType,
      event_id: eventId,
    };
    const response = await fetch(flaskURL + "/update_event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_event),
      credentials: "include",
    });
    if (!response.ok) {
      alert("Something went wrong, refresh your website!");
      return;
    } else {
      switch (response.status) {
        case 201:
          console.log("Event updated successfully");
          break;
        case 205:
          alert("Event not updated!");
          break;
        case 206:
          alert("Missing information!");
          break;
      }
    }

    setEventName("");
    setEventStartDate("");
    setEventEndDate("");
    setEventStartTime("");
    setEventEndTime("");
    setEventLocation("");
    setEventDescription("");
    setEventType("");
    setEventRepetitionType("none");
    setEventCustomFrequencyUnit("");
    setEventCustomFrequencyValue(1);
    toggleShowUpdateEventPopup();
  };

  // END UPDATE EVENT STUFF

  console.log(d.format("MM/DD"));
  const today = new Date(d);
  const localDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const isoToday = localDay.toISOString();
  const todayString = isoToday.slice(0, 10);

  console.log(todayString);

  const lastDayInt = Math.floor(lastDay.getDate());
  let date = firstDaySeeker(today);

  let viewType = selectMode == 1 ? "Day" : "Week";

  const calendarRef = useRef();

  useEffect(() => {
    //console.log("this is called", e);
    calendarRef.current.control.update({
      startDate: todayString,
      events: e,
    });
  }, [e, d]);

  const handleOnEventClick = async (args) => {
    console.log(args);
    setEventId(args.e.data.fb_event_id);
    const response = await fetch(flaskURL + "/get_event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        event_id: args.e.data.fb_event_id,
      }),
      credentials: "include",
    });
    if (!response.ok) {
      alert("Event Info Not Found. Please log-out and log-in again");
    } else {
      switch (response.status) {
        case 201:
          const responseData = await response.json();
          setEventName(responseData["name"]);
          setEventStartDate(responseData["start_date"]);
          setEventEndDate(responseData["end_date"]);
          setEventStartTime(responseData["start_time"]);
          setEventEndTime(responseData["end_time"]);
          setEventLocation(responseData["location"]);
          setEventDescription(responseData["desc"]);
          setEventType(responseData["type"]);
          setEventRepetitionType(responseData["repetition_type"]);
          setEventCustomFrequencyUnit(responseData["repetition_unit"]);
          setEventCustomFrequencyValue(responseData["repetition_val"]);
          toggleShowUpdateEventPopup();
          break;
        case 202:
          alert("Event Not Found");
          break;
        case 205:
          alert("Failing to retrieve event data");
          break;
      }
    }
  };

  // Function to handle the creation of a new calendar
  /*const handleCreateCalendar = async () => {
    if (!newCalendarName.localeCompare("")) {
      alert("Please enter a calendar name!");
      return;
    }
    const regex = /[\\"\t\n\'\\\x00-\x1F\x7F]/g;
    if (regex.test(newCalendarName)) {
      alert("Calendar name includes prohibited characters!");
      return;
    }
    const calendarExists = calendarList.some(
      (calendar) => calendar.name === newCalendarName
    );
    if (calendarExists) {
      alert("A calendar with the same name already exists.");
      setNewCalendarName("");
      return;
    }
    const new_calendar = {
      newCalendarName: newCalendarName,
      user_id: user_id,
    };
    const response = await fetch(flaskURL + "/create_calendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_calendar),
      credentials: "include",
    });
    if (!response.ok) {
      alert("Something went wrong, refresh your website!");
      return;
    } else {
      switch (response.status) {
        case 201:
          console.log("Calendar created successfully");
          const responseData = await response.json();
          setCalendarList([
            ...calendarList,
            {
              calendar_id: responseData["calendar_id"],
              name: newCalendarName,
            },
          ]);
          break;
        case 205:
          alert("Calendar not created!");
          break;
        case 206:
          alert("Missing information!");
          break;
        case 207:
          alert("Calendar not added to user!");
          break;
      }
    }
    toggleShowUpdateEventPopup();
  };*/

  return (
    <div className="sub_main_calnedar_box">
      <div
        style={{
          display: selectMode === 1 || selectMode === 2 ? "block" : "none",
        }}
      >
        <DayPilotCalendar
          {...{ viewType: viewType }}
          ref={calendarRef}
          onEventClick={handleOnEventClick}
        />
      </div>

      {showUpdateEventPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Update Event</h2>
            <div>
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
                <label htmlFor="eventStartTime">Start Time:</label>
                <input
                  type="time"
                  id="eventStartTime"
                  value={eventStartTime}
                  onChange={handleEventStartTimeChange}
                />
                <label htmlFor="eventEndTime">End Time:</label>
                <input
                  type="time"
                  id="eventEndTime"
                  value={eventEndTime}
                  onChange={handleEventEndTimeChange}
                />
              </div>
              {eventType === "event" && (
                <div className="formgroup">
                  <label htmlFor="eventLocation">Event Location:</label>
                  {renderLocationInput()}
                </div>
              )}
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
                  <button
                    type="button"
                    onClick={() => handleEventRepetitionChange("none")}
                  >
                    None
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEventRepetitionChange("daily")}
                  >
                    Daily
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEventRepetitionChange("weekly")}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEventRepetitionChange("monthly")}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEventRepetitionChange("yearly")}
                  >
                    Yearly
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEventRepetitionChange("custom")}
                  >
                    Custom
                  </button>
                </div>
                {eventRepetitionType === "custom" && (
                  <div className="custom-repetition">
                    <label htmlFor="customFrequency">Repeat every</label>
                    <input
                      type="number"
                      id="eventCustomFrequencyValue"
                      value={eventCustomFrequencyValue}
                      onChange={handleEventCustomFrequencyValueChange}
                      min={1}
                    />
                    <select
                      id="eventCustomFrequencyUnit"
                      value={eventCustomFrequencyUnit}
                      onChange={handleEventCustomFrequencyUnitChange}
                    >
                      <option value="days">days</option>
                      <option value="weeks">weeks</option>
                      <option value="months">months</option>
                      <option value="years">years</option>
                    </select>
                    {eventCustomFrequencyUnit === "weeks" && (
                      <div className="day-selector">
                        <p>Select specific days:</p>
                        <label>
                          <input
                            type="checkbox"
                            checked={eventSelectedDays.includes("sun")}
                            onChange={() => handleEventDayToggle("sun")}
                          />
                          Sunday
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={eventSelectedDays.includes("mon")}
                            onChange={() => handleEventDayToggle("mon")}
                          />
                          Monday
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={eventSelectedDays.includes("tues")}
                            onChange={() => handleEventDayToggle("tues")}
                          />
                          Tuesday
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={eventSelectedDays.includes("wed")}
                            onChange={() => handleEventDayToggle("wed")}
                          />
                          Wednesday
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={eventSelectedDays.includes("thur")}
                            onChange={() => handleEventDayToggle("thur")}
                          />
                          Thursday
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={eventSelectedDays.includes("fri")}
                            onChange={() => handleEventDayToggle("fri")}
                          />
                          Friday
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={eventSelectedDays.includes("sat")}
                            onChange={() => handleEventDayToggle("sat")}
                          />
                          Saturday
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button className="formbutton fb1" onClick={handleUpdateEvent}>
                Update
              </button>
              <button
                className="formbutton fb2"
                onClick={toggleShowUpdateEventPopup}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: selectMode === 3 ? "block" : "none" }}>
        <div>
          <table className="month_table">
            <tr>
              <th className="head_month_box">Sun</th>
              <th className="head_month_box">Mon</th>
              <th className="head_month_box">Tue</th>
              <th className="head_month_box">Wed</th>
              <th className="head_month_box">Thu</th>
              <th className="head_month_box">Fri</th>
              <th className="head_month_box">Sat</th>
            </tr>
            <tr>
              <td className="body_month_box">
                {printerForMode3(date, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 1, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 2, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 3, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 4, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 5, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 6, lastDayInt)}
              </td>
            </tr>
            <tr>
              <td className="body_month_box">
                {printerForMode3(date + 7, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 8, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 9, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 10, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 11, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 12, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 13, lastDayInt)}
              </td>
            </tr>
            <tr>
              <td className="body_month_box">
                {printerForMode3(date + 14, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 15, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 16, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 17, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 18, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 19, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 20, lastDayInt)}
              </td>
            </tr>
            <tr>
              <td className="body_month_box">
                {printerForMode3(date + 21, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 22, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 23, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 24, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 25, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 26, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 27, lastDayInt)}
              </td>
            </tr>
            <tr>
              <td className="body_month_box">
                {printerForMode3(date + 28, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 29, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 30, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 31, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 32, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 33, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 34, lastDayInt)}
              </td>
            </tr>
            <tr>
              <td className="body_month_box">
                {printerForMode3(date + 35, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 36, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 37, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 38, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 39, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 40, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 41, lastDayInt)}
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div style={{ display: selectMode === 4 ? "block" : "none" }}>
        <table className="month_table">
          <tr className="MonthBoxFor4">
            <td className="MonthBoxFor4">January</td>
            <td className="MonthBoxFor4">Febuary</td>
            <td className="MonthBoxFor4">March</td>
            <td className="MonthBoxFor4">April</td>
          </tr>
          <tr className="MonthBoxFor4">
            <td className="MonthBoxFor4">May</td>
            <td className="MonthBoxFor4">June</td>
            <td className="MonthBoxFor4">July</td>
            <td className="MonthBoxFor4">August</td>
          </tr>
          <tr className="MonthBoxFor4">
            <td className="MonthBoxFor4">September</td>
            <td className="MonthBoxFor4">October</td>
            <td className="MonthBoxFor4">November</td>
            <td className="MonthBoxFor4">December</td>
          </tr>
        </table>
      </div>
    </div>
  );
}
