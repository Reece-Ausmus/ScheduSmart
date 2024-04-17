// This is a page to realize taking notes function
import React, { useState } from "react";
import "./Notes.css";
import AddIcon from "@material-ui/icons/Add";
import NoteCard from "../components/NoteCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from "@material-ui/icons/Edit";
import Dashboard from "./Dashboard";
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

export default function Notes() {
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

  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  const [values, setvalues] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.title || !note.content) {
      toast.error("Please fill in the field");
      return;
    }

    if (editIndex === -1) {
      setvalues((prevVal) => {
        return [...prevVal, note];
      });
    } else {
      // Updating an existing item
      const updatedItem = [...values];
      updatedItem[editIndex] = {
        title: note.title,
        content: note.content
      };
      setvalues(updatedItem);
      setEditIndex(-1);
    }

    setNote({
      title: "",
      content: ""
    });
  };

  const deleteNote = (id) => {
    setvalues((prevNote) => {
      return prevNote.filter((noteItem, index) => {
        return index !== id;
      });
    });
  };

  const EditNote = (id) => {
    setEditIndex(id);
    setNote({
      title: values[id].title,
      content: values[id].content
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="main">
        <div>{Dashboard()}</div>
        <div className="header">
          <h1 style={{ color: theme.palette.primary.main }}>Notes</h1>
        </div>

        <div>
          <form className="create-note" action="">
            <input
              name="title"
              onChange={handleChange}
              value={note.title}
              placeholder="Title"
              type="text"
            />
            <textarea
              name="content"
              onChange={handleChange}
              value={note.content}
              placeholder="Take a note..."
              rows={3}
              type="text"
            />

            <button data-testid="test1" onClick={handleSubmit}>
              {editIndex === -1 ? <AddIcon /> : <EditIcon />}
            </button>
          </form>
        </div>

        {values &&
          values.map((item, index) => {
            return (
              <NoteCard
                key={index}
                id={index}
                title={item.title}
                content={item.content}
                onDelete={deleteNote}
                onEdit={() => EditNote(index)}
              />
            );
          })}

        <ToastContainer autoClose={1000} />
      </div>
    </ThemeProvider>
  );
}
