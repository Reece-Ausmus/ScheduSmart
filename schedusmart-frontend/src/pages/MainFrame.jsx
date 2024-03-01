import React, { useState } from "react";
import "./MainFrame.css";
import Joyride from "react-joyride";
import { Navigate } from "react-router-dom";
import Weather from './Weather'
import Timezone from './Timezone'
import PopUpForm from '../components/PopupForm';

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
            <tr class="MonthBoxFor4">
              <td class="MonthBoxFor4">January</td>
              <td class="MonthBoxFor4">Febuary</td>
              <td class="MonthBoxFor4">March</td>
              <td class="MonthBoxFor4">April</td>
            </tr>
            <tr class="MonthBoxFor4">
              <td class="MonthBoxFor4">May</td>
              <td class="MonthBoxFor4">June</td>
              <td class="MonthBoxFor4">July</td>
              <td class="MonthBoxFor4">August</td>
            </tr>
            <tr class="MonthBoxFor4">
              <td class="MonthBoxFor4">September</td>
              <td class="MonthBoxFor4">October</td>
              <td class="MonthBoxFor4">November</td>
              <td class="MonthBoxFor4">December</td>
            </tr>
          </table>
        </div>
      </div>
    );
  }

 

  function upperBarPackage() {
    // handle redirects
    const [goToSettings, setGoToSettings] = React.useState(false)
    const [goToDragAndDrop, setGoToDragAndDrop] = React.useState(false);
    const [goToWelcome, setGoToWelcome] = React.useState(false)

    if (goToSettings) {
      return(
          <>
          <Navigate to="/settings" />
          </>
      );
    }

    if (goToWelcome) {
      return(
          <>
          <Navigate to="/welcome" />
          </>
      );
    }

    if (goToDragAndDrop) {
    return (
      <>
        <Navigate to="/draganddrop" />
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
        <button className="upperBarButton" onClick={() => {setGoToWelcome(true)}}>
          Logout
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

  function addEvent() {
    const [showPopup, setShowPopup] = useState(false);
    const [eventName, setEventName] = useState("");
    const [eventStartDate, setEventStartDate] = useState("");
    const [eventEndDate, setEventEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [repetitionType, setRepetitionType] = useState('daily'); // Default to daily
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
                  <input type="text" id="eventName" value={eventName} onChange={handleEventNameChange}/>
                </div>
                <div className="formgroup">
                  <label htmlFor="eventStartDate">Start Date:</label>
                  <input type="date" id="eventStartDate" value={eventStartDate} onChange={handleEventStartDateChange}/>
                  <label htmlFor="eventEndDate">End Date:</label>
                  <input type="date" id="eventEndDate" value={eventEndDate} onChange={handleEventEndDateChange}/>
                </div>
                <div className="formgroup">
                  <label htmlFor="startTime">Start Time:</label>
                  <input type="time" id="startTime" value={startTime} onChange={handleStartTimeChange}/>
                  <label htmlFor="endTime">End Time:</label>
                  <input type="time" id="endTime" value={endTime} onChange={handleEndTimeChange}/>
                </div>
                <div className="formgroup">
                  <label htmlFor="eventLocation">Event Location:</label>
                  <input type="text" id="eventLocation" value={eventLocation} onChange={handleEventLocationChange}/>
                </div>
                <div className="formgroup">
                  <label htmlFor="eventDescription">Event Description:</label>
                  <textarea id="eventDescription" value={eventDescription} onChange={handleEventDescriptionChange} rows="4" cols="50"/>
                </div>
                <div className="event-repetition-form">
                  <h2>Event Repetition</h2>
                  <div className="repetition-options">
                    <button onClick={() => handleRepetitionChange('daily')}>Daily</button>
                    <button onClick={() => handleRepetitionChange('weekly')}>Weekly</button>
                    <button onClick={() => handleRepetitionChange('monthly')}>Monthly</button>
                    <button onClick={() => handleRepetitionChange('yearly')}>Yearly</button>
                    <button onClick={() => handleRepetitionChange('custom')}>Custom</button>
                    </div>
                    {repetitionType === 'custom' && (
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
                        {customFrequencyUnit === 'weeks' && (
                          <div className="day-selector">
                            <p>Select specific days:</p>
                            <label>
                              <input
                                type="checkbox"
                                checked={selectedDays.includes('sun')}
                                onChange={() => handleDayToggle('sun')}
                              />
                              Sunday
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={selectedDays.includes('mon')}
                                onChange={() => handleDayToggle('mon')}
                              />
                              Monday
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={selectedDays.includes('tues')}
                                onChange={() => handleDayToggle('tues')}
                              />
                              Tuesday
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={selectedDays.includes('wed')}
                                onChange={() => handleDayToggle('wed')}
                              />
                              Wednesday
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={selectedDays.includes('thur')}
                                onChange={() => handleDayToggle('thur')}
                              />
                              Thursday
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={selectedDays.includes('fri')}
                                onChange={() => handleDayToggle('fri')}
                              />
                              Friday
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={selectedDays.includes('sat')}
                                onChange={() => handleDayToggle('sat')}
                              />
                              Saturday
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                </div>
                <button className="formbutton fb1" type="submit">Add</button>
                <button className="formbutton fb2" onClick={togglePopup}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  function CalendarList({ calendars }) {
    // Define new states
    const [newCalendarName, setNewCalendarName] = useState("");
    const [calendarList, setCalendarList] = useState(calendars);
    const [selectedCalendars, setSelectedCalendars] = useState([]);
  
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

      setCalendarList([...calendarList, {id: nextCalendarID++, name: newCalendarName}]);
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
        </div>
        {/* List of existing calendars */}
        <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
          {calendarList.map((calendar) => (
            <li key={calendar.id}>
              <input
                type="checkbox"
                id={calendar.id}
                checked={selectedCalendars.includes(calendar.id)}
                onChange={() => handleCalendarSelection(calendar.id)}
              />
              <label htmlFor={calendar.id}>{calendar.name}</label>
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

    const togglePopup = () => {
      setShowPopup(!showPopup);
    };
  
    const handleAmountOFTimeChange = (e) => {
      setAmountOfTime(e.target.value);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Amount of Time:", amountOfTime);
      setAmountOfTime("");
      togglePopup();
    };
  
    return (
      <div className="add_button">
        <button onClick={togglePopup}>Closest Available Time</button>
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h2>Time (hr)</h2>
              <form onSubmit={handleSubmit}>
                <div className="formgroup">
                  <label htmlFor="aomuntOfTime">Enter the amount of time:</label>
                  <input type="text" id="amountOfTime" value={amountOfTime} onChange={handleAmountOFTimeChange}/>
                </div>
                <button className="formbutton fb1" type="submit">Search</button>
                <button className="formbutton fb2" onClick={togglePopup}>Cancel</button>
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
    String(today.getMonth()) + "/" + String(today.getDate())
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

  const [calendars, setCalendars] = useState([
    { id: 0, name: "Personal" },
    { id: 1, name: "School" },
    { id: 2, name: "Work" },
  ]);

  let nextCalendarID = calendars.length;

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
      <div>{addEvent()}</div>
      <div>{upperBarPackage()}</div>

      {/* Parent container for CalendarList and calendar_container */}
      <div className="main-calendar-content">
        {/* CalendarList component */}
        <div className="calendar-list-container">
          <CalendarList calendars={calendars} />
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
