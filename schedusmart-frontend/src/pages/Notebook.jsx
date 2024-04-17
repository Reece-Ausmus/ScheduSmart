// This is a page to record all things have been done in the past
import React, { useState, useEffect } from "react";
import "./Notes.css";
import EventCard from "../components/EventCard";
import AddCard from "../components/AddingEvent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { user_id } from "../config";
import send_request from "./requester";
import Dashboard from "./Dashboard";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EmailForm from "../components/Email";
import { red, orange, yellow, green, blue, purple, pink } from "@mui/material/colors";
import { useLocation } from 'react-router-dom';

const Colors = [
  { id: 0, value: { primary: red[500], secondary: red[400] }, label: "Red" },
  { id: 1, value: { primary: orange[300], secondary: orange[200] }, label: "Orange" },
  { id: 2, value: { primary: yellow[300], secondary: yellow[200] }, label: "Yellow" },
  { id: 3, value: { primary: green[200], secondary: green[100] }, label: "Green" },
  { id: 4, value: { primary: blue[200], secondary: blue[100] }, label: "Blue" },
  { id: 5, value: { primary: purple[200], secondary: purple[100] }, label: "Purple" },
  { id: 6, value: { primary: pink[200], secondary: pink[100] }, label: "Pink" },
];

export default function Notebook() {
  const location = useLocation();
  let Color;
  if (location.state == null) {
    Color = localStorage.getItem('system_color');
  }
  else {
    Color = location.state.color_choice;
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: Colors[Color].value.primary,
      },
      secondary: {
        main: Colors[Color].value.secondary,
      },
    },
  });

  const [events, setEvents] = useState([]);
  const [flag, setFlag] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showDtailsPopup, setShowDetailsPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showCreate, setShowCreate] = useState(false);


  useEffect(() => {
    const fetchEvents = async () => {
      try {

        const user_info = {
            user_id: user_id,
        };

        const response = await send_request("/get_done_events", user_info);

        console.log(response)

        if (response.data == undefined){
            console.log("Something went wrong!")

        }
        else{
            console.log("get done events!")

            if (response.data.length != 0){
            
                setFlag(true);
                setEvents(response.data);
            }
        }

      } catch (e) {
        console.log(e);
      }
    };

    fetchEvents();
  }, []);

  function handleShowEmailPopup(){
    setShowEmailPopup(!showEmailPopup)
  }

  function handleSendEmail(){
    let message = "You have completed:\n\n";

    for (let i = 0; i < events.length; i++){
        const temp = events[i].title + ": " + events[i].content + "\n";
        message += temp;
    }
    console.log(message)

    EmailForm(name, email, message);

    handleShowEmailPopup()
    
  }

  function showDetails(){
    setShowDetailsPopup(!showDtailsPopup)
  }

  const handleAddRecord = async () => {
    const calendar_id = sessionStorage.getItem("taskCalendarId");
    const new_event = {
      name: title,
      desc: description,
      start_time: "",
      end_time: "12:30",
      start_date: "",
      end_date: "2024-01-01",
      location: "",
      calendar: calendar_id,
      repetition_type: "none",
      repetition_unit: "",
      repetition_val: 1,
      selected_days: [],
      user_id: user_id,
      emails: [],
      type: "notebook",
      conferencing_link: "",
    };

    const create_event_response = await send_request(
      "/create_event",
      new_event
    );
    if (create_event_response["error"] !== undefined) {
      alert(create_event_response["error"]);
    } else {
      console.log("Event created successfully");

      setEvents((prevVal) => {
        return [...prevVal, {title: title, content: description}];
      });
    }

    showCreating()
  }

  function showCreating(){
    setShowCreate(!showCreate)
  }

  return (
    <ThemeProvider theme={theme}>
        <div className="main">
        <div>{Dashboard()}</div>
        <div className="header">
            <h1 style={{ color: theme.palette.primary.main }}>Notebook</h1>
        </div>

        <div>
            <Button variant="contained" onClick={handleShowEmailPopup}>send email</Button>
        </div>
        {showEmailPopup && (
            <div className="popup">
              <div className="popup-content">
                <h2>
                    Email Address
                </h2>
                <div className="formgroup">
                  <label htmlFor="email">
                    enter email address
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="formgroup">
                  <label htmlFor="name">
                    enter recepient name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <button
                  className="formbutton fb1"
                  onClick={handleSendEmail}
                >
                  send
                </button>
                <button
                  className="formbutton fb2"
                  onClick={handleShowEmailPopup}
                >
                  cancel
                </button>
              </div>
            </div>
          )
        }

        <div>
          <div><h2>Meetings</h2></div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {flag &&
              events.map((item, index) => {
                  return (
                  <EventCard
                      key={index}
                      id={index}
                      title={item.title}
                      content={item.content}
                      onDetails={() => showDetails(index)}
                  />
                  );
              })}

              {showDtailsPopup && (
                <div className="popup">
                  <div className="popup-content">
                    <h2>
                        Details
                    </h2>
                    <div className="formgroup">
                      <label htmlFor="email">
                        enter email address
                      </label>
                      <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="formgroup">
                      <label htmlFor="name">
                        enter recepient name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
              
                    <button
                      className="formbutton fb2"
                      onClick={showDetails}
                    >
                      close
                    </button>
                  </div>
                </div>
              )}

              <AddCard
                onCreate={() => showCreating()}
              />

              {showCreate && (
                <div className="popup">
                  <div className="popup-content">
                    <h2>
                        Add Record
                    </h2>
                    <div className="formgroup">
                      <label htmlFor="email">
                        title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <p>description</p>
                    <div className="formgroup">
                      <textarea
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="10"
                        cols="50"
                      />
                    </div>
                    <button
                      className="formbutton fb1"
                      onClick={handleAddRecord}
                    >
                      send
                    </button>
              
                    <button
                      className="formbutton fb2"
                      onClick={showCreating}
                    >
                      close
                    </button>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>

     

        <ToastContainer autoClose={1000} />
        </div>
    </ThemeProvider>
  );
}
