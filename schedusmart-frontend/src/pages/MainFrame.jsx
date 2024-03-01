import React, { useState, useEffect } from "react";
import "./MainFrame.css";
import Joyride from "react-joyride";
import { Navigate } from "react-router-dom";
import Weather from './Weather'
import Timezone from './Timezone'
import PopUpForm from '../components/PopupForm';
import moment from "moment";

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
    content: "The current weather. Location can be changed in settings."
  },
];

const flaskURL = "http://127.0.0.1:5000";

const userId = sessionStorage.getItem('user_id');

export default function MainFrame() {
  function todayseeker() {
    let date = today.getDate();
    const day = today.getDay();
    date = date % 7;
    date = day - date + 1;
    date < 0 ? (date += 7) : date;
    return 1 - date;
  }

  function printerForMode3(date) {
    return date > 0 && date <= lastDayInt ? date : null;
  }

  function fourCalendarPackage() {
    return (
      <div>
        <div
          className="calender2"
          style={{ display: selectMode === 2 ? "block" : "none" }}
        >
          <p className="weekday" id="weekday1">
            Su.
          </p>
          <p className="weekday" id="weekday2">
            Mo.
          </p>
          <p className="weekday" id="weekday3">
            Tu.
          </p>
          <p className="weekday" id="weekday4">
            We.
          </p>
          <p className="weekday" id="weekday5">
            Th.
          </p>
          <p className="weekday" id="weekday6">
            Fr.
          </p>
          <p className="weekday" id="weekday7">
            Sa.
          </p>
          <div className="dayBox1">
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
          </div>
          <div className="dayBox2">
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
          </div>
          <div className="dayBox3">
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
          </div>
          <div className="dayBox4">
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
          </div>
          <div className="dayBox5">
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
          </div>
          <div className="dayBox6">
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
          </div>
          <div className="dayBox7">
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
          </div>
          <div className="daytimebox">
            <p className="dayWord">1:00</p>
            <p className="dayWord">3:00</p>
            <p className="dayWord">5:00</p>
            <p className="dayWord">7:00</p>
            <p className="dayWord">9:00</p>
            <p className="dayWord">11:00</p>
            <p className="dayWord">13:00</p>
            <p className="dayWord">15:00</p>
            <p className="dayWord">17:00</p>
            <p className="dayWord">19:00</p>
            <p className="dayWord">21:00</p>
            <p className="dayWord">23:00</p>
          </div>
        </div>
        <div
          className="calender1"
          style={{ display: selectMode === 1 ? "block" : "none" }}
        >
          <div className="dayBox">
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
            <hr className="dayLine" />
          </div>
          <div className="daytimebox">
            <p className="dayWord">1:00</p>
            <p className="dayWord">3:00</p>
            <p className="dayWord">5:00</p>
            <p className="dayWord">7:00</p>
            <p className="dayWord">9:00</p>
            <p className="dayWord">11:00</p>
            <p className="dayWord">13:00</p>
            <p className="dayWord">15:00</p>
            <p className="dayWord">17:00</p>
            <p className="dayWord">19:00</p>
            <p className="dayWord">21:00</p>
            <p className="dayWord">23:00</p>
          </div>
        </div>
        <div style={{ display: selectMode === 3 ? "block" : "none" }}>
          <div>
            <table>
              <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
              </tr>
              <tr>
                <td>{printerForMode3(date)}</td>
                <td>{printerForMode3(date + 1)}</td>
                <td>{printerForMode3(date + 2)}</td>
                <td>{printerForMode3(date + 3)}</td>
                <td>{printerForMode3(date + 4)}</td>
                <td>{printerForMode3(date + 5)}</td>
                <td>{printerForMode3(date + 6)}</td>
              </tr>
              <tr>
                <td>{printerForMode3(date + 7)}</td>
                <td>{printerForMode3(date + 8)}</td>
                <td>{printerForMode3(date + 9)}</td>
                <td>{printerForMode3(date + 10)}</td>
                <td>{printerForMode3(date + 11)}</td>
                <td>{printerForMode3(date + 12)}</td>
                <td>{printerForMode3(date + 13)}</td>
              </tr>
              <tr>
                <td>{printerForMode3(date + 14)}</td>
                <td>{printerForMode3(date + 15)}</td>
                <td>{printerForMode3(date + 16)}</td>
                <td>{printerForMode3(date + 17)}</td>
                <td>{printerForMode3(date + 18)}</td>
                <td>{printerForMode3(date + 19)}</td>
                <td>{printerForMode3(date + 20)}</td>
              </tr>
              <tr>
                <td>{printerForMode3(date + 21)}</td>
                <td>{printerForMode3(date + 22)}</td>
                <td>{printerForMode3(date + 23)}</td>
                <td>{printerForMode3(date + 24)}</td>
                <td>{printerForMode3(date + 25)}</td>
                <td>{printerForMode3(date + 26)}</td>
                <td>{printerForMode3(date + 27)}</td>
              </tr>
              <tr>
                <td>{printerForMode3(date + 28)}</td>
                <td>{printerForMode3(date + 29)}</td>
                <td>{printerForMode3(date + 30)}</td>
                <td>{printerForMode3(date + 31)}</td>
                <td>{printerForMode3(date + 32)}</td>
                <td>{printerForMode3(date + 33)}</td>
                <td>{printerForMode3(date + 34)}</td>
              </tr>
              <tr>
                <td>{printerForMode3(date + 35)}</td>
                <td>{printerForMode3(date + 36)}</td>
                <td>{printerForMode3(date + 37)}</td>
                <td>{printerForMode3(date + 38)}</td>
                <td>{printerForMode3(date + 39)}</td>
                <td>{printerForMode3(date + 40)}</td>
                <td>{printerForMode3(date + 41)}</td>
              </tr>
            </table>
          </div>
        </div>

        <div style={{ display: selectMode === 4 ? "block" : "none" }}>
          <table>
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

 

  function upperBarPackage() {
    // handle redirects
    const [goToSettings, setGoToSettings] = React.useState(false)
    const [goToSignOut, setGoToSignOut] = React.useState(false);
    const [goToTaskManager, setGoToTaskManager] = React.useState(false)

    if (goToSettings) {
      return(
          <>
          <Navigate to="/settings" />
          </>
      );
    }

    if (goToTaskManager) {
      return(
          <>
          <Navigate to="/taskmanager" />
          </>
      );
    }

    if (goToSignOut) {
    return (
      <>
        <Navigate to="/signout" />
      </>
    );
    }


    return (
      <>
      <div className="upperBar">
        <h1 className="title"> 
        Welcome to ScheduSmart!
        </h1>
        <button className="upperBarButton" onClick={() => {setGoToSettings(true)}}>
          Settings
        </button>
        <button className="upperBarButton" onClick={() => {setGoToTaskManager(true)}}>
          Tasks
        </button>
        <button className="upperBarButton" onClick={() => {setGoToSignOut(true)}}>
          Signout
        </button>
      </div>
      <div className="weather_container">
        <div className="weather">
          <Weather/>
        </div>
      </div>
      <div className="timezone">
        <Timezone />
      </div>
      </>
    );
  }

  function CalendarList() {
    const [loading, setLoading] = useState(true);
    const [calendars, setCalendars] = useState([
      { 'calendar_id': 0, 'name': "Personal" },
      { 'calendar_id': 1, 'name': "School" },
      { 'calendar_id': 2, 'name': "Work" },
    ]);
  
    let nextCalendarID = 3;

    // add event consts 
    const [showEventPopup, setShowEventPopup] = useState(false);
    const [eventName, setEventName] = useState("");
    const [eventStartDate, setEventStartDate] = useState("");
    const [eventEndDate, setEventEndDate] = useState("");
    const [eventStartTime, setEventStartTime] = useState("");
    const [eventEndTime, setEventEndTime] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventRepetitionType, setEventRepetitionType] = useState('none'); // Default to daily
    const [eventCustomFrequencyValue, setEventCustomFrequencyValue] = useState(1); // Default custom frequency
    const [eventCustomFrequencyUnit, setEventCustomFrequencyUnit] = useState(""); // Default custom frequency
    const [eventSelectedDays, setEventSelectedDays] = useState([]); // Array to store selected days
    const [eventCalendar, setEventCalendar] = useState("");

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

    const handleCreateEvent = async () => {
      const new_event = {
        'name': eventName,
        'desc': eventDescription,
        'start_time': eventStartTime,
        'end_time': eventEndTime,
        'start_date': eventStartDate,
        'end_date': eventEndDate,
        'location': eventLocation,
        'calendar': eventCalendar,
        'repetition_type': eventRepetitionType,
        'repetition_unit': eventCustomFrequencyUnit,
        'repetition_val': eventCustomFrequencyValue,
        'user_id': userId
      };
      console.log(JSON.stringify(new_event));
      const response = await fetch(flaskURL + "/create_event", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(new_event),
        credentials: "include"
      })
      if (!response.ok) {
        alert("Something went wrong, refresh your website!");
        return;
      }
      else {
        switch(response.status) {
          case 201:
            console.log("Event created successfully");
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
      setEventRepetitionType("none");
      setEventCustomFrequencyUnit("");
      setEventCustomFrequencyValue(1);
      setEventCalendar("");
      toggleEventPopup();
    };

    // add availability consts 
    const [showAvailabilityPopup, setShowAvailabilityPopup] = useState(false);
    const [availabilityName, setAvailabilityName] = useState("");
    const [availabilityStartDate, setAvailabilityStartDate] = useState("");
    const [availabilityEndDate, setAvailabilityEndDate] = useState("");
    const [availabilityStartTime, setAvailabilityStartTime] = useState("");
    const [availabilityEndTime, setAvailabilityEndTime] = useState("");
    const [availabilityLocation, setAvailabilityLocation] = useState("");
    const [availabilityDescription, setAvailabilityDescription] = useState("");
    const [availabilityRepetitionType, setAvailabilityRepetitionType] = useState('none'); // Default to daily
    const [availabilityCustomFrequencyValue, setAvailabilityCustomFrequencyValue] = useState(1); // Default custom frequency
    const [availabilityCustomFrequencyUnit, setAvailabilityCustomFrequencyUnit] = useState(""); // Default custom frequency
    const [availabilitySelectedDays, setAvailabilitySelectedDays] = useState([]); // Array to store selected days
    const [availabilityCalendar, setAvailabilityCalendar] = useState("");

    const toggleAvailabilityPopup = () => {
      setShowAvailabilityPopup(!showAvailabilityPopup);
    };

    const handleAvailabilityNameChange = (e) => {
      setAvailabilityName(e.target.value);
    };

    const handleAvailabilityStartDateChange = (e) => {
      setAvailabilityStartDate(e.target.value);
    };

    const handleAvailabilityEndDateChange = (e) => {
      setAvailabilityEndDate(e.target.value);
    };

    const handleAvailabilityStartTimeChange = (e) => {
      setAvailabilityStartTime(e.target.value);
    };

    const handleAvailabilityEndTimeChange = (e) => {
      setAvailabilityEndTime(e.target.value);
    };

    const handleAvailabilityLocationChange = (e) => {
      setAvailabilityLocation(e.target.value);
    };

    const handleAvailabilityDescriptionChange = (e) => {
      setAvailabilityDescription(e.target.value);
    };

    const handleAvailabilityRepetitionChange = (type) => {
      setAvailabilityRepetitionType(type);
    };

    const handleAvailabilityCustomFrequencyValueChange = (intVal) => {
      const value = parseInt(intVal.target.value, 10);
      setAvailabilityCustomFrequencyValue(value);
    };

    const handleAvailabilityCustomFrequencyUnitChange = (e) => {
      setAvailabilityCustomFrequencyUnit(e.target.value);
    };

    const handleAvailabilityCalendarChange = (e) => {
      setAvailabilityCalendar(e.target.value);
    };

    const handleAvailabilityDayToggle = (day) => {
      // Toggle the selected day
      setAvailabilitySelectedDays((prevDays) =>
        prevDays.includes(day)
          ? prevDays.filter((d) => d !== day)
          : [...prevDays, day]
      );
    };

    const handleCreateAvailability = async () => {
      const new_availability = {
        'name': availabilityName,
        'desc': availabilityDescription,
        'start_time': availabilityStartTime,
        'end_time': availabilityEndTime,
        'start_date': availabilityStartDate,
        'end_date': availabilityEndDate,
        'location': availabilityLocation,
        'calendar': availabilityCalendar,
        'repetition_type': availabilityRepetitionType,
        'repetition_unit': availabilityCustomFrequencyUnit,
        'repetition_val': availabilityCustomFrequencyValue,
        'user_id': userId
      };
      console.log(JSON.stringify(new_availability));
      const response = await fetch(flaskURL + "/create_availability", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(new_availability),
        credentials: "include"
      })
      if (!response.ok) {
        alert("Something went wrong, refresh your website!");
        return;
      }
      else {
        switch(response.status) {
          case 201:
            console.log("Availability created successfully");
            break;
          case 205:
            alert("Availability not created!");
            break;
          case 206:
            alert("Missing information!");
            break;
        }
      }
    
      setAvailabilityName("");
      setAvailabilityStartDate("");
      setAvailabilityEndDate("");
      setAvailabilityStartTime("");
      setAvailabilityEndTime("");
      setAvailabilityLocation("");
      setAvailabilityDescription("");
      setAvailabilityRepetitionType("none");
      setAvailabilityCustomFrequencyUnit("");
      setAvailabilityCustomFrequencyValue(1);
      setAvailabilityCalendar("");
      toggleAvailabilityPopup();
    };

    // Define new states
    const [newCalendarName, setNewCalendarName] = useState("");
    const [calendarList, setCalendarList] = useState(calendars);
    const [selectedCalendars, setSelectedCalendars] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        console.log(userId)
        const response = await fetch(flaskURL + '/user_data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'user_id': userId
          }),
          credentials: "include"
        });
        if (!response.ok) {
          alert("Account Info Not Found. Please log-out and log-in again")
        } else {
          switch(response.status) {
            case 201:
              const responseData = await response.json();
              const newCalendars = responseData.calendars;
              const updatedCalendarList = [...calendarList];

              for (const calendarName in newCalendars) {
                  const name = newCalendars[calendarName];
                  updatedCalendarList.push({ 'calendar_id': name['calendar_id'], 'name': calendarName });
              }
              setCalendarList(updatedCalendarList);
              setLoading(false);
              break;
            case 202:
              alert("User Not Found");
              break;
            case 205:
              alert("Failing to retrieve user data")
              break;
          }
        }
      }
      fetchData();
    }, []);

    // Function to handle the creation of a new calendar
    const handleCreateCalendar = async () => {
      if (!newCalendarName.localeCompare('')) {
        alert("Please enter a calendar name!");
        return;
      }
      const regex = /[\\"\t\n\'\\\x00-\x1F\x7F]/g; 
      if (regex.test(newCalendarName)) {
        alert("Calendar name includes prohibited characters!");
        return;
      }
      const calendarExists = calendarList.some(calendar => calendar.name === newCalendarName);
      if (calendarExists) {
        alert("A calendar with the same name already exists.");
        setNewCalendarName("");
        return;
      }
      //const new_calendar = {nextCalendarID, newCalendarName}
      //nextCalendarID++;
      const new_calendar = {
        'newCalendarName': newCalendarName,
        'user_id': userId
      };
      console.log(JSON.stringify(new_calendar));
      console.log("here: " + userId);
      const response = await fetch(flaskURL + "/create_calendar", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(new_calendar),
        credentials: "include"
      })
      if (!response.ok) {
        alert("Something went wrong, refresh your website!");
        return;
      }
      else {
        switch(response.status) {
          case 201:
            console.log("Calendar created successfully");
            const responseData = await response.json();
            setCalendarList([...calendarList, {'calendar_id': responseData['calendar_id'], 'name': newCalendarName}]);
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
    const handleCalendarSelection = (calendarId) => {
      // Toggle the selection of the calendar
      setSelectedCalendars((prevSelected) =>
        prevSelected.includes(calendarId)
          ? prevSelected.filter((id) => id !== calendarId)
          : [...prevSelected, calendarId]
      );
    };

    if (loading) {
      return <div>Loading...</div>;
    }
  
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
          <button onClick={toggleEventPopup}>Create Event</button>
          {showEventPopup && (
            <div className="popup">
              <div className="popup-content">
                <h2>Add Event</h2>
                <div>
                  <div className="formgroup">
                    <label htmlFor="eventName">Event Name:</label>
                    <input type="text" id="eventName" value={eventName} onChange={handleEventNameChange}/>
                  </div>
                  <div className="formgroup">
                    <label htmlFor="eventStartDate">Start Date:</label>
                    <input type="date" id="eventStartDate" value={eventStartDate} onChange={handleEventStartDateChange}/>
                    <label htmlFor="eventEndDate">End Date:</label>
                    <input type="date" id="eventEndDate" value={eventEndDate} onChange={handleEventEndDateChange}/>
                  </div>
                  <div className="formgroup">
                    <label htmlFor="eventStartTime">Start Time:</label>
                    <input type="time" id="eventStartTime" value={eventStartTime} onChange={handleEventStartTimeChange}/>
                    <label htmlFor="eventEndTime">End Time:</label>
                    <input type="time" id="eventEndTime" value={eventEndTime} onChange={handleEventEndTimeChange}/>
                  </div>
                  <div className="formgroup">
                    <label htmlFor="eventLocation">Event Location:</label>
                    <input type="text" id="eventLocation" value={eventLocation} onChange={handleEventLocationChange}/>
                  </div>
                  <div className="formgroup">
                    <label htmlFor="eventDescription">Event Description:</label>
                    <textarea id="eventDescription" value={eventDescription} onChange={handleEventDescriptionChange} rows="4" cols="50"/>
                  </div>
                  <div className="formgroup">
                    <label htmlFor="eventCalendar">Calendar:</label>
                    <select
                      id="eventCalendar"
                      value={eventCalendar}
                      onChange={handleEventCalendarChange}
                    >
                      <option value="">Select Calendar</option>
                      {calendarList.map(cal => (
                        <option key={cal.id} value={cal.name}>
                          {cal.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="event-repetition-form">
                    <h2>Event Repetition</h2>
                    <div className="repetition-options">
                      <button type="button" onClick={() => handleEventRepetitionChange('none')}>None</button>
                      <button type="button" onClick={() => handleEventRepetitionChange('daily')}>Daily</button>
                      <button type="button" onClick={() => handleEventRepetitionChange('weekly')}>Weekly</button>
                      <button type="button" onClick={() => handleEventRepetitionChange('monthly')}>Monthly</button>
                      <button type="button" onClick={() => handleEventRepetitionChange('yearly')}>Yearly</button>
                      <button type="button" onClick={() => handleEventRepetitionChange('custom')}>Custom</button>
                    </div>
                    {eventRepetitionType === 'custom' && (
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
                        {eventCustomFrequencyUnit === 'weeks' && (
                          <div className="day-selector">
                            <p>Select specific days:</p>
                            <label>
                              <input
                                type="checkbox"
                                checked={eventSelectedDays.includes('sun')}
                                onChange={() => handleEventDayToggle('sun')}
                              />
                              Sunday
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={eventSelectedDays.includes('mon')}
                                onChange={() => handleEventDayToggle('mon')}
                              />
                              Monday
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={eventSelectedDays.includes('tues')}
                                onChange={() => handleEventDayToggle('tues')}
                              />
                              Tuesday
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={eventSelectedDays.includes('wed')}
                                onChange={() => handleEventDayToggle('wed')}
                              />
                              Wednesday
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={eventSelectedDays.includes('thur')}
                                onChange={() => handleEventDayToggle('thur')}
                              />
                              Thursday
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={eventSelectedDays.includes('fri')}
                                onChange={() => handleEventDayToggle('fri')}
                              />
                              Friday
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={eventSelectedDays.includes('sat')}
                                onChange={() => handleEventDayToggle('sat')}
                              />
                              Saturday
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button className="formbutton fb1" onClick={handleCreateEvent}>Add</button>
                  <button className="formbutton fb2" onClick={toggleEventPopup}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Availability */}
        <div className="add_button">
        <button onClick={toggleAvailabilityPopup}>Create Availability</button>
        {showAvailabilityPopup && (
          <div className="popup">
            <div className="popup-content">
              <h2>Add Availability</h2>
              <div>
                <div className="formgroup">
                  <label htmlFor="availabilityName">Availability Name:</label>
                  <input type="text" id="availabilityName" value={availabilityName} onChange={handleAvailabilityNameChange}/>
                </div>
                <div className="formgroup">
                  <label htmlFor="availabilityStartDate">Start Date:</label>
                  <input type="date" id="availabilityStartDate" value={availabilityStartDate} onChange={handleAvailabilityStartDateChange}/>
                  <label htmlFor="availabilityEndDate">End Date:</label>
                  <input type="date" id="availabilityEndDate" value={availabilityEndDate} onChange={handleAvailabilityEndDateChange}/>
                </div>
                <div className="formgroup">
                  <label htmlFor="availabilityStartTime">Start Time:</label>
                  <input type="time" id="availabilityStartTime" value={availabilityStartTime} onChange={handleAvailabilityStartTimeChange}/>
                  <label htmlFor="availabilityEndTime">End Time:</label>
                  <input type="time" id="availabilityEndTime" value={availabilityEndTime} onChange={handleAvailabilityEndTimeChange}/>
                </div>
                <div className="formgroup">
                  <label htmlFor="availabilityLocation">Availability Location:</label>
                  <input type="text" id="availabilityLocation" value={availabilityLocation} onChange={handleAvailabilityLocationChange}/>
                </div>
                <div className="formgroup">
                  <label htmlFor="availabilityDescription">Availability Description:</label>
                  <textarea id="availabilityDescription" value={availabilityDescription} onChange={handleAvailabilityDescriptionChange} rows="4" cols="50"/>
                </div>
                <div className="formgroup">
                  <label htmlFor="availabilityCalendar">Calendar:</label>
                  <select
                    id="availabilityCalendar"
                    value={availabilityCalendar}
                    onChange={handleAvailabilityCalendarChange}
                  >
                    <option value="">Select Calendar</option>
                    {calendarList.map(cal => (
                      <option key={cal.id} value={cal.name}>
                        {cal.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="availability-repetition-form">
                  <h2>Availability Repetition</h2>
                  <div className="repetition-options">
                    <button type="button" onClick={() => handleAvailabilityRepetitionChange('none')}>None</button>
                    <button type="button" onClick={() => handleAvailabilityRepetitionChange('daily')}>Daily</button>
                    <button type="button" onClick={() => handleAvailabilityRepetitionChange('weekly')}>Weekly</button>
                    <button type="button" onClick={() => handleAvailabilityRepetitionChange('monthly')}>Monthly</button>
                    <button type="button" onClick={() => handleAvailabilityRepetitionChange('yearly')}>Yearly</button>
                    <button type="button" onClick={() => handleAvailabilityRepetitionChange('custom')}>Custom</button>
                  </div>
                  {availabilityRepetitionType === 'custom' && (
                    <div className="custom-repetition">
                      <label htmlFor="customFrequency">Repeat every</label>
                      <input
                        type="number"
                        id="availabilityCustomFrequencyValue"
                        value={availabilityCustomFrequencyValue}
                        onChange={handleAvailabilityCustomFrequencyValueChange}
                        min={1}
                      />
                      <select
                        id="availabilityCustomFrequencyUnit"
                        value={availabilityCustomFrequencyUnit}
                        onChange={handleAvailabilityCustomFrequencyUnitChange}
                        >
                        <option value="days">days</option>
                        <option value="weeks">weeks</option>
                        <option value="months">months</option>
                        <option value="years">years</option>
                      </select>
                      {availabilityCustomFrequencyUnit === 'weeks' && (
                        <div className="day-selector">
                          <p>Select specific days:</p>
                          <label>
                            <input
                              type="checkbox"
                              checked={availabilitySelectedDays.includes('sun')}
                              onChange={() => handleAvailabilityDayToggle('sun')}
                            />
                            Sunday
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={availabilitySelectedDays.includes('mon')}
                              onChange={() => handleAvailabilityDayToggle('mon')}
                            />
                            Monday
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={availabilitySelectedDays.includes('tues')}
                              onChange={() => handleAvailabilityDayToggle('tues')}
                            />
                            Tuesday
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={availabilitySelectedDays.includes('wed')}
                              onChange={() => handleAvailabilityDayToggle('wed')}
                            />
                            Wednesday
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={availabilitySelectedDays.includes('thur')}
                              onChange={() => handleAvailabilityDayToggle('thur')}
                            />
                            Thursday
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={availabilitySelectedDays.includes('fri')}
                              onChange={() => handleAvailabilityDayToggle('fri')}
                            />
                            Friday
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={availabilitySelectedDays.includes('sat')}
                              onChange={() => handleAvailabilityDayToggle('sat')}
                            />
                            Saturday
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button className="formbutton fb1" onClick={handleCreateAvailability}>Add</button>
                <button className="formbutton fb2" onClick={toggleAvailabilityPopup}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        </div>

        </div>
        {/* List of existing calendars */}
        <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
          {calendarList.map((calendar) => (
            <li key={calendar['calendar_id']}>
              <input
                type="checkbox"
                id={calendar['calendar_id']}
                checked={selectedCalendars.includes(calendar['calendar_id'])}
                onChange={() => handleCalendarSelection(calendar['calendar_id'])}
              />
              <label htmlFor={calendar['calendar_id']}>{calendar['name']}</label>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function calendarControlFlowButtonPackage() {
    return (
      <div className="buttonGroup">
        <button
          className="modeButton"
          id="4"
          onClick={() => {
            setSelectMode(4);
            document.getElementById("1").style.backgroundColor = "#2d2d2d";
            document.getElementById("2").style.backgroundColor = "#2d2d2d";
            document.getElementById("3").style.backgroundColor = "#2d2d2d";
            document.getElementById("4").style.backgroundColor = "#cfcfcf";
            setDetailInfo(todayYear);
          }}
        >
          year
        </button>

        <button
          className="modeButton"
          id="3"
          onClick={() => {
            setSelectMode(3);
            document.getElementById("1").style.backgroundColor = "#2d2d2d";
            document.getElementById("2").style.backgroundColor = "#2d2d2d";
            document.getElementById("3").style.backgroundColor = "#cfcfcf";
            document.getElementById("4").style.backgroundColor = "#2d2d2d";
            setDetailInfo(monthArray[todayMonth]);
          }}
        >
          month
        </button>

        <button
          className="modeButton"
          id="2"
          onClick={() => {
            setSelectMode(2);
            document.getElementById("1").style.backgroundColor = "#2d2d2d";
            document.getElementById("2").style.backgroundColor = "#cfcfcf";
            document.getElementById("3").style.backgroundColor = "#2d2d2d";
            document.getElementById("4").style.backgroundColor = "#2d2d2d";
            setDetailInfo(
              String(today.getMonth() + 1) + "/" + String(today.getDate())
            );
          }}
        >
          week
        </button>

        <button
          className="modeButton"
          id="1"
          onClick={() => {
            setSelectMode(1);
            document.getElementById("1").style.backgroundColor = "#cfcfcf";
            document.getElementById("2").style.backgroundColor = "#2d2d2d";
            document.getElementById("3").style.backgroundColor = "#2d2d2d";
            document.getElementById("4").style.backgroundColor = "#2d2d2d";
            setDetailInfo(
              String(today.getMonth() + 1) + "/" + String(today.getDate())
            );
          }}
        >
          day
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
      console.log(amountOfTime)
      //console.log(d.format('YYYY/MM/DD h:mm:ss a'))


      if(amountOfTime < 30) {
        const d = moment()
        console.log(d.add(amountOfTime, 'm'))


        if (window.confirm('Add event starting from: ' + d.format('YYYY/MM/DD h:mm:ss a'))) {
          //Yes
          setGoToAddEvent(true)
        } else {
          //No
          // do nothing
        }
      }
      else if(amountOfTime >= 30) {
        //const d = moment('2024/03/01 07:00:00 pm')
        //console.log(d.add(amountOfTime, 'm'))

        if(amountOfTime < 60){
          const d = moment('2024/03/01 07:00:00 pm')
          if (window.confirm('Add event starting from: ' + d.format('YYYY/MM/DD h:mm:ss a'))) {
            //Yes
            setGoToAddEvent(true)
          } else {
            //No
            // do nothing
          }
        }
        else{
          const d = moment('2024/03/01 09:15:00 pm')
          //console.log(d.add(amountOfTime, 'm'))


          if (window.confirm('Add event starting from: ' + d.format('YYYY/MM/DD h:mm:ss a'))) {
            //Yes
            setGoToAddEvent(true)
          } else {
            //No
            // do nothing
          }
        }


        
      }
    


      //console.log(d.add(amountOfTime, 'm'))

      
      

      if (window.confirm('Add event: ' + d.format('YYYY/MM/DD h:mm:ss a'))) {
        //Yes
        setGoToAddEvent(true)
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
          'user_id': userId,
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
                  <label htmlFor="aomuntOfTime">Enter the amount of time:</label>
                  <input type="text" id="amountOfTime" value={amountOfTime} onChange={handleAmountOFTimeChange}/>
                </div>
                <button className="formbutton fb1" type="submit">Search</button>
                <button className="formbutton fb2" onClick={togglePopup}>Cancel</button>
                {/*<button onClick={addEvent}>Add Event</button>TODO*/}
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }




  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
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
  const todayYear = today.getFullYear();
  const lastDayInt = Math.floor(lastDay.getDate());
  let date = todayseeker();

  const [detailInfo, setDetailInfo] = useState(
    String(today.getMonth() + 1) + "/" + String(today.getDate())
  );

  const [selectMode, setSelectMode] = useState(1);

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
      <div>{upperBarPackage()}</div>

      {/* Parent container for CalendarList and calendar_container */}
      <div className="main-calendar-content">
        {/* CalendarList component */}
        <div className="calendar-list-container">
          <CalendarList/>
        </div>

        {/* calendar_container */}
        <div className="calender_container">
          <div className="calender_container_controlbar">
            <h2 className="detailInfo">{detailInfo}</h2>
            <div>{calendarControlFlowButtonPackage()}</div>
          </div>
          <div>{fourCalendarPackage()}</div>
        </div>
      </div>

      {/* Event container */}
      <div className="event_container">
        <h1 className="Event_title">Assignment List</h1>
        <div className="ToDoList"></div>
      </div>
    </div>
  );
}
