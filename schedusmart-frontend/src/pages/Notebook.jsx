// This is a page to record all things have been done in the past
import React, { useState, useEffect } from "react";
import "./Notes.css";
import EventCard from "../components/EventCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { user_id } from "../config";
import send_request from "./requester";
import Dashboard from "./Dashboard";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { orange } from "@mui/material/colors";
import EmailForm from "../components/Email";

const theme = createTheme({
    palette: {
      primary: orange,
      secondary: {
        main: "#ab5600",
      },
    },
});
  

export default function Notebook() {

  const [events, setEvents] = useState([]);
  const [flag, setFlag] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");


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

  return (
    <ThemeProvider theme={theme}>
        <div className="main">
        <div>{Dashboard()}</div>
        <div className="header">
            <h1>Notebook</h1>
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
        
        {flag &&
        events.map((item, index) => {
            return (
            <EventCard
                key={index}
                id={index}
                title={item.title}
                content={item.content}
                onEdit={() => EditNote(index)}
            />
            );
        })}

        {!flag &&
            <p>Nothing has been completed</p>
        }

        <ToastContainer autoClose={1000} />
        </div>
    </ThemeProvider>
  );
}
