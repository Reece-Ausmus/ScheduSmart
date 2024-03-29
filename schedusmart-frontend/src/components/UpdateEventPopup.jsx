import React, { useState, useEffect } from "react";
export default function UpdateEventPopup(event_id, LocationSettings) {
  const [eventName, setEventName] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventEmailInvitations, setEventEmailInvitations] = useState([]);
  const [eventType, setEventType] = useState("");
  const [eventRepetitionType, setEventRepetitionType] = useState("none");
  const [eventCustomFrequencyValue, setEventCustomFrequencyValue] = useState(1);
  const [eventCustomFrequencyUnit, setEventCustomFrequencyUnit] = useState("");
  const [eventSelectedDays, setEventSelectedDays] = useState([]); // Array to store selected days
  const [eventCalendar, setEventCalendar] = useState("");

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

  const handleEventEmailInvitationsChange = (e) => {
    setEventEmailInvitations(
      e.target.value.split(",").map((email) => email.trim())
    );
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

  const handleEventCalendarChange = (e) => {
    setEventCalendar(e.target.value);
  };

  const handleEventDayToggle = (day) => {
    // Toggle the selected day
    setEventSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleCreateEventButton = () => {
    setEventName("");
    setEventStartDate("");
    setEventEndDate("");
    setEventStartTime("");
    setEventEndTime("");
    setEventLocation("");
    setEventDescription("");
    setEventEmailInvitations([]);
    setEventType("event");
    setEventRepetitionType("none");
    setEventCustomFrequencyValue(1);
    setEventCustomFrequencyUnit("");
    setEventSelectedDays([]);
    setEventCalendar("");
    toggleEventPopup();
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
      calendar: calendarList.find((cal) => cal.name === eventCalendar)
        ?.calendar_id,
      repetition_type: eventRepetitionType,
      repetition_unit: eventCustomFrequencyUnit,
      repetition_val: eventCustomFrequencyValue,
      selected_days: eventSelectedDays,
      user_id: user_id,
      emails: eventEmailInvitations,
      type: eventType,
    };
    const response = await fetch(flaskURL + "/create_event", {
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
          console.log("Event created successfully");
          const data = await response.json();
          new_event["event_id"] = data["event_id"];
          setEvents([...events, new_event]);
          break;
        case 205:
          alert("Event not created!");
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
    setEventEmailInvitations([]);
    setEventType("");
    setEventRepetitionType("none");
    setEventCustomFrequencyUnit("");
    setEventCustomFrequencyValue(1);
    setEventCalendar("");
    toggleEventPopup();
  };
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

        {eventType === "event" && (
          <div>
            <div className="formgroup">
              <label htmlFor="eventEmailInvitations">
                Invite Emails: (Separate emails with commas)
              </label>
              <input
                type="text"
                id="eventEmailInvitations"
                value={eventEmailInvitations}
                onChange={handleEventEmailInvitationsChange}
              />
            </div>

            <div className="formgroup">
              <label htmlFor="eventCalendar">Calendar:</label>
              <select
                id="eventCalendar"
                value={eventCalendar}
                onChange={handleEventCalendarChange}
                className="calendar_option"
              >
                <option value="">Select Calendar</option>
                {calendarList.map((cal) => (
                  <option key={cal.id} value={cal.id}>
                    {cal.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
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
        <button className="formbutton fb2" onClick={toggleEventPopup}>
          Cancel
        </button>
      </div>
    </div>
  </div>;
}
