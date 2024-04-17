// This document is used for the components of dashboard
import React from "react";
import "./MainFrame.css";
import { useState, useRef, useEffect } from "react";
import { flaskURL, user_id } from "../config";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import languageData from "../components/language.json";
import send_request from "./requester";
import moment from "moment";
import { red } from "@mui/material/colors";

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

export default function Calendar(selectMode, e, d, language) {
  // BEGIN UPDATE EVENT STUFF

  const [eventId, setEventId] = useState("");
  const [showUpdateEventPopup, setShowUpdateEventPopup] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventConferencingLink, setEventConferencingLink] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventRepetitionType, setEventRepetitionType] = useState("none");
  const [eventCustomFrequencyValue, setEventCustomFrequencyValue] = useState(1);
  const [eventCustomFrequencyUnit, setEventCustomFrequencyUnit] = useState("");
  const [eventSelectedDays, setEventSelectedDays] = useState([]); // Array to store selected days
  const [LocationSettings, setLocationSettings] = useState("text");
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    if (eventName === undefined) {
      setEventName("");
    }
    if (eventStartDate === undefined) {
      setEventStartDate("");
    }
    if (eventEndDate === undefined) {
      setEventEndDate("");
    }
    if (eventStartTime === undefined) {
      setEventStartTime("");
    }
    if (eventEndTime === undefined) {
      setEventEndTime("");
    }
    if (eventConferencingLink === undefined) {
      setEventConferencingLink("");
    }
    if (eventLocation === undefined) {
      setEventLocation("");
    }
    if (eventDescription === undefined) {
      setEventDescription("");
    }
    if (eventType === undefined) {
      setEventType("");
    }
    if (eventRepetitionType === undefined) {
      setEventRepetitionType("none");
    }
    if (eventCustomFrequencyUnit === undefined) {
      setEventCustomFrequencyUnit("");
    }
    if (eventCustomFrequencyValue === undefined) {
      setEventCustomFrequencyValue(1);
    }
    if (eventSelectedDays === undefined) {
      setEventSelectedDays([]);
    }
    if (LocationSettings === undefined) {
      setLocationSettings("text");
    }
    if (unsavedChanges === undefined) {
      setUnsavedChanges(false);
    }

    if (
      eventName !== "" &&
      eventStartDate !== "" &&
      eventEndDate !== "" &&
      eventStartTime !== "" &&
      eventEndTime !== "" &&
      eventType !== ""
    ) {
      setShowUpdateEventPopup(true);
    }
    setUnsavedChanges(true);
  }, [
    eventName,
    eventStartDate,
    eventEndDate,
    eventStartTime,
    eventEndTime,
    eventConferencingLink,
    eventLocation,
    eventDescription,
    eventType,
    eventRepetitionType,
  ]);

  const toggleShowUpdateEventPopup = () => {
    setShowUpdateEventPopup(!showUpdateEventPopup);
    setEventName("");
    setEventStartDate("");
    setEventEndDate("");
    setEventStartTime("");
    setEventEndTime("");
    setEventConferencingLink("");
    setEventLocation("");
    setEventDescription("");
    setEventType("");
    setEventRepetitionType("none");
    setEventCustomFrequencyUnit("");
    setEventCustomFrequencyValue(1);
    setUnsavedChanges(false);
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

  const handleEventConferencingLinkChange = (e) => {
    setEventConferencingLink(e.target.value);
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
      conferencing_link: eventConferencingLink,
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
    setEventConferencingLink("");
    setEventLocation("");
    setEventDescription("");
    setEventType("");
    setEventRepetitionType("none");
    setEventCustomFrequencyUnit("");
    setEventCustomFrequencyValue(1);
    toggleShowUpdateEventPopup();
  };

  const handleDeleteEvent = async () => {
    const new_event = {
      user_id: user_id,
      event_id: eventId,
    };
    const response = await fetch(flaskURL + "/delete_event", {
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
          console.log("Event deleted successfully");
          break;
        case 205:
          alert("Event not deleted!");
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
    setEventConferencingLink("");
    setEventLocation("");
    setEventDescription("");
    setEventType("");
    setEventRepetitionType("none");
    setEventCustomFrequencyUnit("");
    setEventCustomFrequencyValue(1);
    toggleShowUpdateEventPopup();
  };

  // END UPDATE EVENT STUFF

  //console.log(d.format("MM/DD"));
  const today = new Date(d);
  const localDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const isoToday = localDay.toISOString();
  const todayString = isoToday.slice(0, 10);

  //console.log(todayString);

  const lastDayInt = Math.floor(lastDay.getDate());
  let date = firstDaySeeker(today);

  let viewType = selectMode == 1 ? "Day" : "Week";

  const [calendar, setCalendar] = useState(false);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef();

  useEffect(() => {
    setEvents(e);
    setCalendar(true);
  }, [e]);

  const handleOnEventClick = async (args) => {
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
          setEventConferencingLink(responseData["conferencing_link"]);
          setEventLocation(responseData["location"]);
          setEventDescription(responseData["desc"]);
          setEventType(responseData["type"]);
          setEventRepetitionType(responseData["repetition_type"]);
          setEventCustomFrequencyUnit(responseData["repetition_unit"]);
          setEventCustomFrequencyValue(responseData["repetition_val"]);
          //setShowUpdateEventPopup(true);
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

  return (
    <div className="sub_main_calnedar_box">
      <div
        style={{
          display: selectMode === 1 || selectMode === 2 ? "block" : "none",
        }}
      >
        {calendar && (
          <DayPilotCalendar
            viewType={viewType}
            events={events}
            controlRef={setCalendar}
            onEventClick={handleOnEventClick}
          />
        )}
      </div>

      {showUpdateEventPopup && (
        <div className="popup">
          <div className="popup-content">
            {unsavedChanges && <h2>{languageData[language][0].main_frame.unsaveEvent}</h2>}
            <h2>{languageData[language][0].main_frame.updateEvent}</h2>
            <div>
              <div className="formgroup">
                <label htmlFor="eventName">
                  {languageData[language][0].main_frame.event_name}
                </label>
                <input
                  type="text"
                  id="eventName"
                  value={eventName}
                  onChange={handleEventNameChange}
                />
              </div>
              <div className="formgroup">
                <label htmlFor="eventStartDate">{languageData[language][0].main_frame.startDate}</label>
                <input
                  type="date"
                  id="eventStartDate"
                  value={eventStartDate}
                  onChange={handleEventStartDateChange}
                />
                <label htmlFor="eventEndDate">{languageData[language][0].main_frame.end_date}</label>
                <input
                  type="date"
                  id="eventEndDate"
                  value={eventEndDate}
                  onChange={handleEventEndDateChange}
                />
              </div>
              <div className="formgroup">
                <label htmlFor="eventStartTime">{languageData[language][0].main_frame.startTime}</label>
                <input
                  type="time"
                  id="eventStartTime"
                  value={eventStartTime}
                  onChange={handleEventStartTimeChange}
                />
                <label htmlFor="eventEndTime">{languageData[language][0].main_frame.endTime}</label>
                <input
                  type="time"
                  id="eventEndTime"
                  value={eventEndTime}
                  onChange={handleEventEndTimeChange}
                />
              </div>
              {eventType === "event" && (
                <div>
                  <div className="formgroup">
                    <label htmlFor="eventLocation">{languageData[language][0].main_frame.eventLocation}</label>
                    {renderLocationInput()}
                  </div>
                  {eventConferencingLink !== "" && (
                    <div className="formgroup">
                      <label htmlFor="eventConferencingLink">
                      {
                              languageData[language][0].main_frame
                                .conferencingLink
                            }
                      </label>
                      <a
                        href={eventConferencingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {eventConferencingLink}
                      </a>
                    </div>
                  )}
                </div>
              )}
              <div className="formgroup">
                <label htmlFor="eventDescription">{languageData[language][0].main_frame.eventDescription}</label>
                <textarea
                  id="eventDescription"
                  value={eventDescription}
                  onChange={handleEventDescriptionChange}
                  rows="4"
                  cols="50"
                />
              </div>
              <div className="event-repetition-form">
                <h2>{languageData[language][0].main_frame.eventRepetition}</h2>
                <div className="repetition-options">
                  <button
                    type="button"
                    onClick={() => handleEventRepetitionChange("none")}
                  >
                    {languageData[language][0].main_frame.none}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEventRepetitionChange("daily")}
                  >
                    {languageData[language][0].main_frame.daily}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEventRepetitionChange("weekly")}
                  >
                    {languageData[language][0].main_frame.weekly}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEventRepetitionChange("monthly")}
                  >
                    {languageData[language][0].main_frame.monthly}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEventRepetitionChange("yearly")}
                  >
                    {languageData[language][0].main_frame.yearly}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEventRepetitionChange("custom")}
                  >
                    {languageData[language][0].main_frame.custome}
                  </button>
                </div>
                {eventRepetitionType === "custom" && (
                  <div className="custom-repetition">
                    <label htmlFor="customFrequency">{languageData[language][0].main_frame.repeatEvery}</label>
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
                      <option value="days">{languageData[language][0].main_frame.days}</option>
                      <option value="weeks">{languageData[language][0].main_frame.weeks}</option>
                      <option value="months">{languageData[language][0].main_frame.months}</option>
                      <option value="years">{languageData[language][0].main_frame.years}</option>
                    </select>
                  </div>
                )}
              </div>
              <button className="formbutton fb1" onClick={handleUpdateEvent}>
              {languageData[language][0].main_frame.update}
              </button>
              <button
                className="formbutton fb2"
                onClick={toggleShowUpdateEventPopup}
              >
                {languageData[language][0].main_frame.cancel}
              </button>
              <button className="formbuttondelete" onClick={handleDeleteEvent}>
              {languageData[language][0].main_frame.delete}
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
