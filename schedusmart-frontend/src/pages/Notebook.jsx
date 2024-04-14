// This is a page to record all things have been done in the past
import React, { useState, useEffect } from "react";
import "./Notes.css";
import AddIcon from "@material-ui/icons/Add";
import EventCard from "../components/EventCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { user_id } from "../config";
import send_request from "./requester";
import Dashboard from "./Dashboard";

export default function Notebook() {
  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  const [values, setvalues] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  const [events, setEvents] = useState([]);
  const [flag, setFlag] = useState(false);


  //const [notes, setNotes] = useState<Note[]>([]);


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

  return (
    <div className="main">
      <div>{Dashboard()}</div>
      <div className="header">
        <h1>Notebook</h1>
      </div>

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
  );
}
