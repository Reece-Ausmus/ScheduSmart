import React, { useState, useEffect } from "react";
import "./MainFrame.css";
import { flaskURL, user_id } from "../config";
import Joyride from "react-joyride";
import { Navigate, Link } from "react-router-dom";
import Weather from "./Weather";
import Timezone from "./Timezone";
import PopUpForm from "../components/PopupForm";
import moment from "moment";
import Dashboard from "./Dashboard";
import Calendar from "./Calendar";
import send_request from "./requester";
import chatBox from "../components/ChatBox";
import Map from "./Googlemap";
import { useHotkeys } from "react-hotkeys-hook";
import { CheckBox, LaptopWindowsRounded } from "@material-ui/icons";
import SetupCourses from "./SetupCourses";
// import MapContainer from './Googlemap';

const steps = [
  {
    target: ".upperBarButton",
    content: "Go to settings",
    disableBeacon: true, // automate to start the tours
  },
  {
    target: ".calender_container_controlbar",
    content: "You can change the format",
  },
  {
    target: ".weather_container",
    content: "The current weather. Location can be changed in settings.",
  },
];

export default function MainFrame() {
  const [selectMode, setSelectMode] = useState(1);
  const [selectedCalendars, setSelectedCalendars] = useState([]);
  /*
  
    { calendar_id: "15e1c4a5f82eeca0a8a57e19bdea4ea5", name: "cal_name" },
    { calendar_id: "1edf8a72d18a382312e04eaa1e8aa8c3", name: "cal_name" },
    { calendar_id: "80ce85b4eaa97197e2dd929f20646552", name: "cal_name" },

  */
  const [goToTaskManager, setGoToTaskManager] = useState(false);
  const [allEventsArray, setAllEventsArray] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const today = new Date();
  const todayMonth = today.getMonth();
  const monthArray = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  //const todayYear = today.getFullYear();

  const [detailInfo, setDetailInfo] = useState(
    String(today.getMonth() + 1) + "/" + String(today.getDate())
  );

  useEffect(() => {
    const fetchDefaultMode = async () => {
      let dataOfDefaultMode = await send_request("/get_calendar_default_mode", {
        user_id: user_id,
      });
      if (dataOfDefaultMode.type == undefined) dataOfDefaultMode.type = 1;
      let dataOfUser = await send_request("/user_data", {
        user_id: user_id,
      });
      setTaskList(dataOfUser.task_list);
      setSelectMode(dataOfDefaultMode.type);
    };

    fetchDefaultMode();
  }, []);

  function CalendarList() {
    const [loading, setLoading] = useState(true);

    // add event consts
    const [events, setEvents] = useState([]);
    const [showEventPopup, setShowEventPopup] = useState(false);
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
    const [eventCustomFrequencyValue, setEventCustomFrequencyValue] =
      useState(1);
    const [eventCustomFrequencyUnit, setEventCustomFrequencyUnit] =
      useState("");
    const [eventSelectedDays, setEventSelectedDays] = useState([]); // Array to store selected days
    const [eventCalendar, setEventCalendar] = useState("");
    const [LocationSettings, setLocationSettings] = useState("text");

    useEffect(() => {
      const fetchDefaultsettings = async () => {
        let dataOfDefaultsettings = await send_request(
          "/get_location_default_settings",
          { user_id: user_id }
        );
        if (dataOfDefaultsettings.type == undefined) return;
        setLocationSettings(dataOfDefaultsettings.type);
      };
      fetchDefaultsettings();
    }, []);
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

    // shortcut to control popup event
    useHotkeys("Shift+a", () => {
      toggleEventPopup();
    });

    const toggleEventPopup = () => {
      setShowEventPopup(!showEventPopup);
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

    const handleCreateAvailabilityButton = () => {
      setEventName("");
      setEventStartDate("");
      setEventEndDate("");
      setEventStartTime("");
      setEventEndTime("");
      setEventLocation("");
      setEventDescription("");
      setEventEmailInvitations([]);
      setEventType("availability");
      setEventRepetitionType("none");
      setEventCustomFrequencyValue(1);
      setEventCustomFrequencyUnit("");
      setEventSelectedDays([]);
      setEventCalendar(
        calendarList.find((cal) => cal.name === "Availability")?.calendar_id
      );
      toggleEventPopup();
    };

    const handleCreateEvent = async () => {
      const new_event = {
        name: eventName,
        desc: eventDescription,
        start_time: eventStartTime,
        end_time: eventEndTime,
        start_date: eventStartDate,
        end_date: eventEndDate,
        location: eventLocation,
        calendar: eventCalendar,
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

    const addInvites = async (eid) => {
      const new_invite = {
        event_id: eid,
        emails: eventEmailInvitations,
        user_id: user_id,
      };
      console.log(new_invite);
      const response = await send_request("/invite_users_to_event", new_invite);
      if (!response.ok) {
        alert("Something went wrong, refresh your website!");
        return;
      } else {
        switch (response.status) {
          case 201:
            console.log("Invitations added successfully");
            break;
          case 205:
            alert("Email invitations not sent!");
            break;
          case 206:
            alert("Missing information!");
            break;
        }
      }
    };

    // Define new states
    const [newCalendarName, setNewCalendarName] = useState("");
    const [calendarList, setCalendarList] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(flaskURL + "/user_data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user_id,
          }),
          credentials: "include",
        });
        if (!response.ok) {
          alert("Account Info Not Found. Please log-out and log-in again");
        } else {
          switch (response.status) {
            case 201:
              const responseData = await response.json();
              const newCalendars = responseData.calendars;
              const updatedCalendarList = [...calendarList];

              for (const calendarName in newCalendars) {
                const name = newCalendars[calendarName];
                updatedCalendarList.push({
                  calendar_id: name["calendar_id"],
                  name: calendarName,
                });
              }
              setCalendarList(updatedCalendarList);
              setLoading(false);
              break;
            case 202:
              alert("User Not Found");
              break;
            case 205:
              alert("Failing to retrieve user data");
              break;
          }
        }
      };
      fetchData();
    }, []);

    // Function to handle the creation of a new calendar
    const handleCreateCalendar = async () => {
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
      //const new_calendar = {nextCalendarID, newCalendarName}
      //nextCalendarID++;
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

      // Clear the input field after creating the calendar
      setNewCalendarName("");
    };

    // Function to handle the selection of a calendar
    const handleCalendarSelection = (calendar) => {
      // Toggle the selection of the calendar
      setSelectedCalendars((prevSelected) =>
        prevSelected.some((cal) => cal.calendar_id === calendar["calendar_id"])
          ? prevSelected.filter(
              (cal) => cal.calendar_id !== calendar["calendar_id"]
            )
          : [...prevSelected, calendar]
      );
    };

    /*if (loading) {
      return <div>Loading...</div>;
    }*/

    const [semesterName, setSemesterName] = useState("");
    const [semesterStartDate, setSemesterStartDate] = useState("");
    const [semesterEndDate, setSemesterEndDate] = useState("");
    const [showSemesterPopup, setShowSemesterPopup] = useState(false);

    const handleSetupCourses = () => {
      setShowSemesterPopup(!showSemesterPopup);
    };

    const handleSemesterSelection = async (e) => {
      e.preventDefault();
      //TODO: validate inputs
      const new_calendar = {
        newCalendarName: semesterName,
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
                name: semesterName,
              },
            ]);
            // TODO need to include start and end dates in session storage as well
            sessionStorage.setItem(
              "semester",
              JSON.stringify({
                calendar_id: responseData["calendar_id"],
                name: semesterName,
                start_date: semesterStartDate,
                end_date: semesterEndDate,
              })
            );
            window.location.href = "./setupcourses";
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
      setShowSemesterPopup(!showSemesterPopup);
    };

    const handleCancelSemester = () => {
      setShowSemesterPopup(!showSemesterPopup);
    };

    const handleSemesterStartDateChange = (e) => {
      setSemesterStartDate(e.target.value);
    };

    const handleSemesterEndDateChange = (e) => {
      setSemesterEndDate(e.target.value);
    };

    return (
      <div className="calendar-list">
        {/* Create Calendar button and input */}
        <div style={{ display: "flex", marginBottom: "10px" }}>
          <input
            type="text"
            value={newCalendarName}
            onChange={(e) => setNewCalendarName(e.target.value)}
            placeholder="Enter new calendar name"
            style={{ width: "calc(100% - 100px)", marginRight: "10px" }}
          />
          <button onClick={handleCreateCalendar} style={{ width: "100px" }}>
            Create Calendar
          </button>

          {/* Add Event */}
          <div className="add_button">
            <button onClick={handleCreateEventButton}>Create Event</button>
          </div>
          <div className="add_button">
            <button onClick={handleCreateAvailabilityButton}>
              Create Availability
            </button>
          </div>
          {showEventPopup && (
            <div className="popup">
              <div className="popup-content">
                <h2>Add {eventType}</h2>
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
                  <button
                    className="formbutton fb1"
                    onClick={handleCreateEvent}
                  >
                    Add
                  </button>
                  <button className="formbutton fb2" onClick={toggleEventPopup}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/*SetupCourses*/}
          {showSemesterPopup && (
            <div className="popup">
              <div className="popup-content">
                <div className="formgroup">
                  <label htmlFor="semesterName">Semester:</label>
                  <input
                    type="text"
                    id="semesterName"
                    value={semesterName}
                    onChange={(e) => setSemesterName(e.target.value)}
                  />
                </div>
                <div className="formgroup">
                  <label htmlFor="semesterStartDate">Start Date:</label>
                  <input
                    type="date"
                    id="semesterStartDate"
                    value={semesterStartDate}
                    onChange={handleSemesterStartDateChange}
                  />
                  <label htmlFor="semesterEndDate">End Date:</label>
                  <input
                    type="date"
                    id="semesterEndDate"
                    value={semesterEndDate}
                    onChange={handleSemesterEndDateChange}
                  />
                </div>
                <button
                  className="formbutton fb1"
                  onClick={handleSemesterSelection}
                >
                  Add
                </button>
                <button
                  className="formbutton fb2"
                  onClick={handleCancelSemester}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <button onClick={handleSetupCourses}>Setup Courses</button>
          {/*<Link to="/setupcourses">
            <button>Setup Courses</button>
          </Link>*/}
        </div>
        {/* List of existing calendars */}
        <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
          {calendarList.map((calendar) => (
            <li key={calendar["calendar_id"]}>
              <input
                type="checkbox"
                id={calendar["calendar_id"]}
                checked={selectedCalendars.some(
                  (cal) => cal.calendar_id === calendar["calendar_id"]
                )}
                onChange={() => handleCalendarSelection(calendar)}
              />
              <label htmlFor={calendar["calendar_id"]}>
                {calendar["name"]}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function calendarControlFlowButtonPackage() {
    /*const d = moment();
    const [currentTime, setCurrentTime] = useState(d);
    
    // plus
    useHotkeys('Shift+p', () => {
      //today.setDate(today.getDate() + 1)
      //console.log(today.toString())
      console.log(selectMode)

      //setCurrentTime(moment(currentTime.add(1, "days")));
      //console.log(currentTime.format('MM/DD'))
      
      switch(selectMode) {
        case 1: case 2:
          today.setDate(today.getDate() + 1)
          //setCurrentTime(moment(currentTime.add(1, "days")));

          setDetailInfo(
            //const temp = currentTime.format('MM/DD')
            //String(currentTime.format('MM/DD'))
            String(today.getMonth() + 1) + "/" + String(today.getDate())
          );
          console.log(today)
          break;
        case 3:
          today.setDate(today.getMonth() + 1)
          setDetailInfo(monthArray[todayMonth]);
          break;
        case 4:
          today.setFullYear(today.getFullYear() + 1)
          break;
      }
      
      setDetailInfo(
        String(today.getMonth() + 1) + "/" + String(today.getDate())
      );
    });
    // minus
    useHotkeys('Shift+m', () => {
      //today.setDate(today.getDate() - 1)
      console.log(today.toString())
    });*/

    return (
      <div className="buttonGroup">
        <button
          style={{ backgroundColor: selectMode == 1 ? "#cfcfcf" : "#2d2d2d" }}
          className="modeButton"
          id="1"
          onClick={() => {
            setSelectMode(1);
            setDetailInfo(
              String(today.getMonth() + 1) + "/" + String(today.getDate())
            );
          }}
        >
          day
        </button>
        <button
          className="modeButton"
          style={{ backgroundColor: selectMode == 2 ? "#cfcfcf" : "#2d2d2d" }}
          id="2"
          onClick={() => {
            setSelectMode(2);
            setDetailInfo(
              String(today.getMonth() + 1) + "/" + String(today.getDate())
            );
          }}
        >
          week
        </button>
        <button
          className="modeButton"
          style={{ backgroundColor: selectMode == 3 ? "#cfcfcf" : "#2d2d2d" }}
          id="3"
          onClick={() => {
            setSelectMode(3);
            setDetailInfo(monthArray[todayMonth]);
          }}
        >
          month
        </button>
        <button
          className="modeButton"
          style={{ backgroundColor: selectMode == 4 ? "#cfcfcf" : "#2d2d2d" }}
          id="4"
          onClick={() => {
            setSelectMode(4);
            setDetailInfo(todayYear);
          }}
        >
          year
        </button>
      </div>
    );
  }

  function PopUpForm() {
    const [showPopup, setShowPopup] = useState(false);
    const [amountOfTime, setAmountOfTime] = useState("");
    const [availableTime, setAvailableTime] = useState("");

    const togglePopup = () => {
      setShowPopup(!showPopup);
    };

    const handleAmountOFTimeChange = (e) => {
      setAmountOfTime(e.target.value);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      //let temp = '12:00 - 13:00'

      //const d = moment()
      console.log(amountOfTime);
      //console.log(d.format('YYYY/MM/DD h:mm:ss a'))

      if (amountOfTime < 30) {
        const d = moment();
        console.log(d.add(amountOfTime, "m"));

        if (
          window.confirm(
            "Add event starting from: " + d.format("YYYY/MM/DD h:mm:ss a")
          )
        ) {
          //Yes
          setGoToAddEvent(true);
        } else {
          //No
          // do nothing
        }
      } else if (amountOfTime >= 30) {
        //const d = moment('2024/03/01 07:00:00 pm')
        //console.log(d.add(amountOfTime, 'm'))

        if (amountOfTime < 60) {
          const d = moment("2024/03/01 07:00:00 pm");
          if (
            window.confirm(
              "Add event starting from: " + d.format("YYYY/MM/DD h:mm:ss a")
            )
          ) {
            //Yes
            setGoToAddEvent(true);
          } else {
            //No
            // do nothing
          }
        } else {
          const d = moment("2024/03/01 09:15:00 pm");
          //console.log(d.add(amountOfTime, 'm'))

          if (
            window.confirm(
              "Add event starting from: " + d.format("YYYY/MM/DD h:mm:ss a")
            )
          ) {
            //Yes
            setGoToAddEvent(true);
          } else {
            //No
            // do nothing
          }
        }
      }

      //console.log(d.add(amountOfTime, 'm'))

      if (window.confirm("Add event: " + d.format("YYYY/MM/DD h:mm:ss a"))) {
        //Yes
        setGoToAddEvent(true);
      } else {
        //No
        // do nothing
      }

      setAmountOfTime("");
      togglePopup();
    };
    /*const handleSubmit = async () => {
          let response = await fetch(flaskURL + "/set_amount_of_time", {
          method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'user_id': user_id,
        'time': amountOfTime
        }),
        credentials: "include"
      })
        let data = await response.json();
        console.log(data.available);
        //setSelectMode(data.type);

        setAmountOfTime("");
        togglePopup();
    };*/

    return (
      <div className="add_button">
        <button onClick={togglePopup}>Closest Available Time</button>
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h2>Time (min)</h2>
              <form onSubmit={handleSubmit}>
                <div className="formgroup">
                  <label htmlFor="aomuntOfTime">
                    Enter the amount of time:
                  </label>
                  <input
                    type="text"
                    id="amountOfTime"
                    value={amountOfTime}
                    onChange={handleAmountOFTimeChange}
                  />
                </div>
                <button className="formbutton fb1" type="submit">
                  Search
                </button>
                <button className="formbutton fb2" onClick={togglePopup}>
                  Cancel
                </button>
                {/*<button onClick={addEvent}>Add Event</button>TODO*/}
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // shortcuts
  useHotkeys("Shift+d", () => setSelectMode(1));
  useHotkeys("Shift+w", () => setSelectMode(2));
  useHotkeys("Shift+m", () => setSelectMode(3));
  useHotkeys("Shift+y", () => setSelectMode(4));

  ////////////////////////////Calendar Events//////////////////////////

  function compareDates(date1, date2) {
    if (date1 > date2) {
      return 1;
    } else if (date1 < date2) {
      return -1;
    } else {
      return 0;
    }
  }

  function addDaysToSpecificDate(date, a) {
    const newDate = new Date(date.getTime() + a * 24 * 60 * 60 * 1000);
    return newDate;
  }

  function addMonthsToSpecificDate(date, a) {
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth() + a,
      date.getDate() + 1
    );
    return newDate;
  }

  function addYearsToSpecificDate(date, a) {
    const newDate = new Date(
      date.getFullYear() + a,
      date.getMonth(),
      date.getDate() + 1
    );
    return newDate;
  }

  function eventParser(event, id_number, boundary) {
    const eventArray = [];

    let id = id_number;
    let event_name = event.name;

    const [year1, month1, day1] = event.start_date.split("-").map(Number);
    const [hour1, min1] = event.start_time.split(":").map(Number);
    const [year2, month2, day2] = event.end_date.split("-").map(Number);
    const [hour2, min2] = event.end_time.split(":").map(Number);

    let firstStartDate = new Date(year1, month1 - 1, day1, hour1, min1, 0);
    firstStartDate.setMinutes(
      firstStartDate.getMinutes() - firstStartDate.getTimezoneOffset()
    );
    let firstEndDate = new Date(year2, month2 - 1, day2, hour2, min2, 0);
    firstEndDate.setMinutes(
      firstEndDate.getMinutes() - firstEndDate.getTimezoneOffset()
    );

    let startDate = addDaysToSpecificDate(firstStartDate, 0);
    let endDate = addDaysToSpecificDate(firstEndDate, 0);
    let counter = 1; //Default will add 1

    console.log(event.repetition_type);

    if (event.repetition_type === "none") {
      eventArray.push({
        id: id,
        text: event_name,
        start: startDate.toISOString().slice(0, 19),
        end: endDate.toISOString().slice(0, 19),
      });
      id++;
    } else if (event.repetition_type === "daily") {
      while (compareDates(startDate, boundary) == -1) {
        eventArray.push({
          id: id,
          text: event_name,
          start: startDate.toISOString().slice(0, 19),
          end: endDate.toISOString().slice(0, 19),
        });
        id++;
        startDate = addDaysToSpecificDate(firstStartDate, counter);
        endDate = addDaysToSpecificDate(firstEndDate, counter);
        counter++;
      }
    } else if (event.repetition_type === "weekly") {
      counter = 7;
      while (compareDates(startDate, boundary) == -1) {
        eventArray.push({
          id: id,
          text: event_name,
          start: startDate.toISOString().slice(0, 19),
          end: endDate.toISOString().slice(0, 19),
        });
        id++;
        startDate = addDaysToSpecificDate(firstStartDate, counter);
        endDate = addDaysToSpecificDate(firstEndDate, counter);
        counter += 7;
      }
    } else if (event.repetition_type === "monthly") {
      while (compareDates(startDate, boundary) == -1) {
        eventArray.push({
          id: id,
          text: event_name,
          start: startDate.toISOString().slice(0, 19),
          end: endDate.toISOString().slice(0, 19),
        });
        id++;
        startDate = addMonthsToSpecificDate(firstStartDate, counter);
        endDate = addMonthsToSpecificDate(firstEndDate, counter);
        counter++;
      }
    } else if (event.repetition_type === "yearly") {
      while (compareDates(startDate, boundary) == -1) {
        eventArray.push({
          id: id,
          text: event_name,
          start: startDate.toISOString().slice(0, 19),
          end: endDate.toISOString().slice(0, 19),
        });
        id++;
        startDate = addYearsToSpecificDate(firstStartDate, counter);
        endDate = addYearsToSpecificDate(firstEndDate, counter);
        counter++;
      }
    } else if (event.repetition_type === "custom") {
      counter = event.repetition_val;
      while (compareDates(startDate, boundary) == -1) {
        eventArray.push({
          id: id,
          text: event_name,
          start: startDate.toISOString().slice(0, 19),
          end: endDate.toISOString().slice(0, 19),
        });
        id++;
        if (event.repetition_unit === "days") {
          startDate = addDaysToSpecificDate(firstStartDate, counter);
          endDate = addDaysToSpecificDate(firstEndDate, counter);
          counter += event.repetition_val;
        } else if (event.repetition_unit === "weeks") {
          startDate = addDaysToSpecificDate(firstStartDate, 7 * counter);
          endDate = addDaysToSpecificDate(firstEndDate, 7 * counter);
          counter += event.repetition_val;
        } else if (event.repetition_unit === "months") {
          startDate = addMonthsToSpecificDate(firstStartDate, counter);
          endDate = addMonthsToSpecificDate(firstEndDate, counter);
          counter += event.repetition_val;
        } else {
          startDate = addYearsToSpecificDate(firstStartDate, counter);
          endDate = addYearsToSpecificDate(firstEndDate, counter);
          counter += event.repetition_val;
        }
      }
    } else {
      console.log("Error occurs: repetition type not parse correctly");
    }

    return eventArray;
  }

  useEffect(() => {
    const fetchEvents = () => {
      if (selectedCalendars == undefined) {
        return;
      }

      const eventsArray = [];
      const today = new Date();
      const localDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      selectedCalendars.map(async (calendar) => {
        let events = await send_request("/get_events", {
          calendar_id: calendar.calendar_id,
        });

        if (events.data != undefined) {
          for (let i = 0; i < events.data.length; i++) {
            eventsArray.push(
              ...eventParser(
                events.data[i],
                eventsArray.length,
                addDaysToSpecificDate(localDay, 7)
              )
            );
          }
        }
      });
      console.log("updates");
      setAllEventsArray(eventsArray);
    };
    fetchEvents();
  }, [selectedCalendars]);

  ///////////////////Task handle///////////////////////////////////
  const generateTaskListHTML = (arr) => {
    if (!arr || arr == undefined) {
      return (
        <div className="taskBar">
          <p>All tasks have been completed.</p>
        </div>
      );
    }
    arr.map((task) => {
      console.log("task: ", task.title);
    });
    return arr.map(
      (task) =>
        !task.completed && (
          <div className="taskBar" onClick={() => {}}>
            <p className="taskName">{task.title}</p>
            <input
              className=".taskCheckBox"
              type="checkbox"
              defaultChecked={false}
              onChange={(e) => {
                changeStatusOfTask(task, e.target.checked);
              }}
            />
          </div>
        )
    );
  };

  const changeStatusOfTask = async (task, statusOfTask) => {
    const currentTime = new Date().toLocaleString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    console.log(statusOfTask);
    task = {
      ...task,
      completed_time: currentTime,
      completed: statusOfTask,
      user_id: user_id,
    };

    console.log(task);
    let res = await send_request("/mark_done", task);
    console.log(res.message);
  };

  // handle drag & drop
  const [goToDragAndDrop, setGoToDragAndDrop] = React.useState(false);

  if (goToDragAndDrop) {
    return (
      <>
        <Navigate to="/draganddrop" />
      </>
    );
  }

  return (
    <div className="container">
      {goToTaskManager && <Navigate to="/taskmanager" />}
      <Joyride
        steps={steps}
        continuous={true}
        styles={{
          options: {
            arrowColor: "#2d2d2d",
            backgroundColor: "#2d2d2d",
            overlayColor: "rgba(45, 45, 45, .3)",
            primaryColor: "#2d2d2d",
            textColor: "#ffffff",
          },
          spotlight: {
            backgroundColor: "transparent",
          },
        }}
        // show the progress
        showProgress={true}
        // user can skip the tours
        showSkipButton={true}
      />
      <div>{PopUpForm()}</div>
      <div>{Dashboard()}</div>
      <div className="weather_container">
        <div className="weather">
          <Weather />
        </div>
      </div>
      <div className="timezone">
        <Timezone />
      </div>

      {/* Parent container for CalendarList and calendar_container */}
      <div className="main-calendar-content">
        {/* CalendarList component */}
        <div className="calendar-list-container">
          <CalendarList />
        </div>

        {/* calendar_container */}
        <div className="calender_container">
          <div className="calender_container_controlbar">
            <h2 className="detailInfo">{detailInfo}</h2>
            <div>{calendarControlFlowButtonPackage()}</div>
          </div>
          <div className="main_calnedar_box">
            {Calendar(selectMode, allEventsArray)}
          </div>
        </div>
      </div>
      <div className="ChatBox">{chatBox()}</div>
      {/* task container */}
      <div className="task_container">
        <div className="task_upperbar">
          <h1 className="task_title">Task</h1>
          <button
            className="modeButton"
            onClick={() => {
              setGoToTaskManager(true);
            }}
          >
            detail
          </button>
        </div>
        <div className="ToDoList">{generateTaskListHTML(taskList)}</div>
      </div>
    </div>
  );
}
