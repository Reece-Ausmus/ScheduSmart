import React, { useState } from "react";
import { flaskURL, user_id } from "../config";
import AddCoursePopup from "../components/AddCoursePopup";
import AddBreakPopup from "../components/AddBreakPopup";

export default function SetupCourses() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseStartTime, setCourseStartTime] = useState("");
  const [courseEndTime, setCourseEndTime] = useState("");
  const [courseSelectedDays, setCourseSelectedDays] = useState([]);
  const [courseLocation, setCourseLocation] = useState("");
  const [breaks, setBreaks] = useState([]);
  const [breakName, setBreakName] = useState("");
  const [breakStartDate, setBreakStartDate] = useState("");
  const [breakEndDate, setBreakEndDate] = useState("");
  const [showCoursePopup, setShowCoursePopup] = useState(false);
  const [showBreakPopup, setShowBreakPopup] = useState(false);

  const semester = JSON.parse(sessionStorage.getItem("semester"));
  if (!semester) {
    alert("Please select a semester first!");
    window.location.href = "/calendar";
  }

  const toggleCoursePopup = () => {
    setShowCoursePopup(!showCoursePopup);
  };

  const toggleBreakPopup = () => {
    setShowBreakPopup(!showBreakPopup);
  };

  const handleDone = () => {
    sessionStorage.removeItem("semester");
    window.location.href = "/calendar";
  };

  const handleCreateCourse = async () => {
    const new_course = {
      name: courseName,
      desc: courseDescription,
      start_time: courseStartTime,
      end_time: courseEndTime,
      start_date: semester.start_date,
      conferencing_link: "",
      end_date: semester.end_date,
      location: courseLocation,
      calendar: semester.calendar_id,
      repetition_type: "custom",
      repetition_unit: "weeks",
      repetition_val: 1,
      selected_days: courseSelectedDays,
      user_id: user_id,
      emails: [],
      type: "course",
    };

    const response = await fetch(flaskURL + "/create_event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_course),
    });
    if (!response.ok) {
      alert("Something went wrong, refresh your website!");
      return;
    } else {
      switch (response.status) {
        case 201:
          console.log("Course created successfully");
          setCourses([...courses, new_course]);
          break;
        case 204:
          alert("Network error!");
          break;
        case 205:
          alert("Course not created!");
          break;
        case 206:
          alert("Missing information!");
          break;
      }
    }
    setCourses([...courses, new_course]);
    setCourseName("");
    setCourseDescription("");
    setCourseStartTime("");
    setCourseEndTime("");
    setCourseSelectedDays([]);
    setCourseLocation("");
    toggleCoursePopup();
  };

  const handleCancelCourse = () => {
    setCourseName("");
    setCourseDescription("");
    setCourseStartTime("");
    setCourseEndTime("");
    setCourseSelectedDays([]);
    setCourseLocation("");
    toggleCoursePopup();
  };

  const handleCourseNameChange = (e) => {
    setCourseName(e.target.value);
  };

  const handleCourseDescriptionChange = (e) => {
    setCourseDescription(e.target.value);
  };

  const handleCourseStartTimeChange = (e) => {
    setCourseStartTime(e.target.value);
  };

  const handleCourseEndTimeChange = (e) => {
    setCourseEndTime(e.target.value);
  };

  const handleEventDayToggle = (day) => {
    // Toggle the selected day
    setCourseSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleCourseLocationChange = (e) => {
    setCourseLocation(e.target.value);
  };

  const handleBreakNameChange = (e) => {
    setBreakName(e.target.value);
  };

  const handleBreakStartDateChange = (e) => {
    setBreakStartDate(e.target.value);
  };

  const handleBreakEndDateChange = (e) => {
    setBreakEndDate(e.target.value);
  };

  const handleCreateBreak = async () => {
    const new_break = {
      name: breakName,
      desc: "",
      start_time: "00:00",
      end_time: "23:59",
      start_date: breakStartDate,
      end_date: breakEndDate,
      conferencing_link: "",
      location: "",
      calendar: semester.calendar_id,
      repetition_type: "daily",
      repetition_unit: "",
      repetition_val: 0,
      selected_days: [],
      user_id: user_id,
      emails: [],
      type: "break",
    };

    const response = await fetch(flaskURL + "/create_event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_break),
    });
    if (!response.ok) {
      alert("Something went wrong, refresh your website!");
      return;
    } else {
      switch (response.status) {
        case 201:
          console.log("Break created successfully");
          setBreaks([...breaks, new_break]);
          break;
        case 204:
          alert("Network error!");
          break;
        case 205:
          alert("Break not created!");
          break;
        case 206:
          alert("Missing information!");
          break;
      }
    }
    setBreaks([...breaks, new_break]);
    setBreakName("");
    setBreakStartDate("");
    setBreakEndDate("");
    toggleBreakPopup();
  };

  const handleCancelBreak = () => {
    setBreakName("");
    setBreakStartDate("");
    setBreakEndDate("");
    toggleBreakPopup();
  };

  return (
    <div>
      <h1>Setup Courses</h1>
      <div>
        <h2>Semester: {semester.name}</h2>
        <button onClick={toggleBreakPopup}>Add Break</button>
        <button onClick={toggleCoursePopup}>Add Course</button>
        {showCoursePopup && (
          <AddCoursePopup
            courseName={courseName}
            handleCourseNameChange={handleCourseNameChange}
            courseDescription={courseDescription}
            handleCourseDescriptionChange={handleCourseDescriptionChange}
            courseStartTime={courseStartTime}
            handleCourseStartTimeChange={handleCourseStartTimeChange}
            courseEndTime={courseEndTime}
            handleCourseEndTimeChange={handleCourseEndTimeChange}
            courseSelectedDays={courseSelectedDays}
            handleCourseDayToggle={handleEventDayToggle}
            courseLocation={courseLocation}
            handleCourseLocationChange={handleCourseLocationChange}
            handleCreateCourse={handleCreateCourse}
            handleCancelCourse={handleCancelCourse}
          />
        )}
        {showBreakPopup && (
          <AddBreakPopup
            breakName={breakName}
            handleBreakNameChange={handleBreakNameChange}
            breakStartDate={breakStartDate}
            handleBreakStartDateChange={handleBreakStartDateChange}
            breakEndDate={breakEndDate}
            handleBreakEndDateChange={handleBreakEndDateChange}
            handleCreateBreak={handleCreateBreak}
            handleCancelBreak={handleCancelBreak}
          />
        )}
        <h2>Breaks:</h2>
        <ul>
          {breaks.map((b, index) => (
            <li key={index}>
              Name: {b.name} | Start: {b.start_date} | End: {b.end_date}
            </li>
          ))}
        </ul>
        <h2>Courses:</h2>
        <ul>
          {courses.map((course, index) => (
            <li key={index}>
              Name: {course.name} | Description: {course.desc}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleDone}>Done</button>
    </div>
  );
}
