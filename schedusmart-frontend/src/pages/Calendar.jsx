import React, { useState, useEffect } from "react";
import "./MainFrame.css";
import Joyride from "react-joyride";
import { Navigate } from "react-router-dom";
import moment from 'moment';

const flaskURL = "http://127.0.0.1:5000";


export default function Calendar() {
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
          {WeekStyle()}
        </div>
        <div
          className="calender1"
          style={{ display: selectMode === 1 ? "block" : "none" }}
        >
          {DayStyle()}
        </div>
        <div style={{ display: selectMode === 3 ? "block" : "none" }}>
          <div>
            {MonthStyle()}
          </div>
        </div>

        <div style={{ display: selectMode === 4 ? "block" : "none" }}>
            {YearStyle()}
        </div>
      </div>
    );
  }

  function upperBarPackage() {
    return (
      <div className="upperBar">
        <h1 className="title">ScheduSmart</h1>
        <button className="upperBarButton">setting</button>
        <button className="upperBarButton" onClick={handleConfirmClick}>
          drag & drop
        </button>
        <button className="upperBarButton">logout</button>
      </div>
    );
  }

  function addEvent() {
    const [showPopup, setShowPopup] = useState(false);
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventDescription, setEventDescription] = useState("");

    const togglePopup = () => {
      setShowPopup(!showPopup);
    };
  
    const handleEventNameChange = (e) => {
      setEventName(e.target.value);
    };
  
    const handleEventDateChange = (e) => {
      setEventDate(e.target.value);
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
                <label htmlFor="eventDate">Event Date:</label>
                <input type="date" id="eventDate" value={eventDate} onChange={handleEventDateChange}/>
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
                <button className="formbutton fb1" type="submit">Add</button>
                <button className="formbutton fb2" onClick={togglePopup}>Cancel</button>
              </form>
            </div>
          </div>
        )}
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
            // here is where origin year display
            //setDetailInfo(todayYear);
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
            // here is where origin month display
            //setDetailInfo(currentMonth.format('MMMM'));
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
            //setDetailInfo(
            //</div>  String(temp)
            //);
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
            // here is where origin day display
            //setDetailInfo(
            //</div>  String(temp)
            //);
          }}
        >
          day
        </button>
      </div>
    );
  }
  const temp = moment().format('YY/MM/DD');
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

  const d = moment();
  let todayYear = d.format('YYYY');
  const lastDayInt = Math.floor(lastDay.getDate());
  let date = todayseeker();

  //const [detailInfo, setDetailInfo] = useState(
  //  String(today.getMonth()) + "/" + String(today.getDate())
  //);

  const [selectMode, setSelectMode] = useState(2);

  useEffect(() => {
    fetch(flaskURL + '/calendarType').then(res => console.log(res));
  }, []);

  // handle drag & drop
  const [goToDragAndDrop, setGoToDragAndDrop] = React.useState(false);

  if (goToDragAndDrop) {
    return (
      <>
        <Navigate to="/draganddrop" />
      </>
    );
  }

  const handleConfirmClick = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      //Yes
      setGoToDragAndDrop(true);
    } else {
      //No
      // do nothing
    }
  };


// handle day
function DayStyle(){
  const d = moment();

  const [currentDay, setCurrentDay] = useState(d);

  const incrementMonth = () => {
    setCurrentDay(moment(currentDay.add(1, "days")));
  }

  const decrementMonth = () => {
    setCurrentDay(moment(currentDay.subtract(1, "days")));
  }

  return(
    <div>
      <button>{currentDay.format('MM/DD')}</button>
      <button onClick={decrementMonth}>Prev</button><button onClick={incrementMonth}>Next</button>
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
  );
};

// handle week
function WeekStyle(){
  const d = moment();

  const [currentWeek, setCurrentWeek] = useState(d);

  const incrementMonth = () => {
    setCurrentWeek(moment(currentWeek.add(1, "weeks")));
  }

  const decrementMonth = () => {
    setCurrentWeek(moment(currentWeek.subtract(1, "weeks")));
  }

  return(
  <div>
    <button>{currentWeek.format('MM/DD')}</button>
    <button onClick={decrementMonth}>Prev</button><button onClick={incrementMonth}>Next</button>
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
  </div>);
};

// handle month 
function MonthStyle() {  
    const d = moment();

    const [currentMonth, setCurrentMonth] = useState(d);

    const incrementMonth = () => {
      setCurrentMonth(moment(currentMonth.add(1, "months")));
    }

    const decrementMonth = () => {
      setCurrentMonth(moment(currentMonth.subtract(1, "months")));
    }

    return (
      <div >
        <button>{currentMonth.format('MMMM YYYY')}</button>
        <button onClick={decrementMonth}>Prev</button><button onClick={incrementMonth}>Next</button>
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
              {getDate(currentMonth.month())}
            </table>
          </div>
      </div>
    );
  }
  
  // function to check and grey out previous & next months visible dates
  function isExtraDays(week, date){
    if (week === 0 && date > 10) {
      return true;
    } else if (week === 5 && date < 10) {
      return true;
    } else if (week === 4 && date < 10) {
      return true;
    } else {
      return false;
    }
  }
  
  //function to get all days by week
  function getDate(month){
    const d = moment();
    let todayYear = d.format('YYYY');


    var calendar = [];
  
    const startDate = moment([todayYear, month])
      .clone()
      .startOf("month")
      .startOf("week");
  
    const endDate = moment([todayYear, month]).clone().endOf("month");
  
    const day = startDate.clone().subtract(1, "day");
  
    // looping a month by a week
    while (day.isBefore(endDate, "day")) {
      calendar.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, "day").clone().format("DD"))
      );
    }
  
    if (calendar.length > 0) {
        return calendar.map((week, index) => (
            <tr>
            {week.map((day) => (
                <td>
                <span className="day-value">
                    {isExtraDays(index, day) ? (
                    <span className="isDates-grey">{day}</span>
                    ) : (
                    day
                    )}
                </span>
                </td>
            ))}
            </tr>
        ));
        }
  };

  // handle year style
  function YearStyle() {
    const d = moment();

    const [currentYear, setCurrentYear] = useState(d);

    const incrementMonth = () => {
      setCurrentYear(moment(currentYear.add(1, "years")));
    }

    const decrementMonth = () => {
      setCurrentYear(moment(currentYear.subtract(1, "years")));
    }

    return(
      <div >
        <button>{currentYear.format('YYYY')}</button>
        <button onClick={decrementMonth}>Prev</button><button onClick={incrementMonth}>Next</button>
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
    );
  };


  return (
    <div className="container">

      {/*calendar*/}
      <div className="calender_container">
        <div className="calender_container_controlbar">
          {/*<h2 className="detailInfo">{detailInfo}</h2> */}
          <div>{calendarControlFlowButtonPackage()}</div>
        </div>
        <div>{fourCalendarPackage()}</div>
      </div>


      {/* Event container */}
      <div className="event_container">
        <h1 className="Event_title">Task List</h1>
        <div className="ToDoList"></div>
      </div>
    </div>

  );
}
