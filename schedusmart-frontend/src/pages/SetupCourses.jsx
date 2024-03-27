import React, { useState } from "react";
import { flaskURL, user_id } from "../config";
import AddCoursePopup from "../components/AddCoursePopup";
import AddBreakPopup from "../components/AddBreakPopup";

export default function SetupCourses() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseStartTime, setCourseStartTime] = useState("");
  const [courseEndTime, setCourseEndTime] = useState("");
  const [courseSelectedDays, setCourseSelectedDays] = useState([]);
  const [courseLocation, setCourseLocation] = useState("");
  const [breaks, setBreaks] = useState([]);
  const [breakName, setBreakName] = useState("");
  const [breakStartDate, setBreakStartDate] = useState("");
  const [breakEndDate, setBreakEndDate] = useState("");
  const [semester, setSemester] = useState("");
  const [semesterStartDate, setSemesterStartDate] = useState("");
  const [semesterEndDate, setSemesterEndDate] = useState("");
  const [showSemesterForm, setShowSemesterForm] = useState(true);
  const [showCoursePopup, setShowCoursePopup] = useState(false);
  const [showBreakPopup, setShowBreakPopup] = useState(false);

  const handleSemesterSelection = (e) => {
    e.preventDefault();
    //TODO: validate inputs
    setShowSemesterForm(!showSemesterForm);
  };

  const toggleCoursePopup = () => {
    setShowCoursePopup(!showCoursePopup);
  };

  const toggleBreakPopup = () => {
    setShowBreakPopup(!showBreakPopup);
  };

  const handleSemesterStartDateChange = (e) => {
    setSemesterStartDate(e.target.value);
  };

  const handleSemesterEndDateChange = (e) => {
    setSemesterEndDate(e.target.value);
  };

  const handleCreateCourse = async () => {
    const new_course = {
      name: courseName,
      number: courseNumber,
      desc: courseDescription,
      start_time: courseStartTime,
      end_time: courseEndTime,
      start_date: semesterStartDate,
      end_date: semesterEndDate,
      location: courseLocation,
      calendar: semester,
      repetition_type: "custom",
      repetition_unit: "weeks",
      repetition_val: 1,
      selected_days: courseSelectedDays,
      user_id: user_id
    };

    /*const response = await fetch(flaskURL + "/add_course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(new_course)
    });
    if (!response.ok) {
      alert("Something went wrong, refresh your website!");
      return;
    } else {
      switch (response.status) {
        case 201:
          console.log("Event created successfully");
          setCourses([...courses, new_course]);
          break;
        case 205:
          alert("Event not created!");
          break;
        case 206:
          alert("Missing information!");
          break;
      }
    }*/
    setCourses([...courses, new_course]);
    setCourseName("");
    setCourseNumber("");
    setCourseDescription("");
    setCourseStartTime("");
    setCourseEndTime("");
    setCourseSelectedDays([]);
    setCourseLocation("");
    toggleCoursePopup();
  };

  const handleCancelCourse = () => {
    setCourseName("");
    setCourseNumber("");
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

  const handleCourseNumberChange = (e) => {
    setCourseNumber(e.target.value);
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

  const handleCreateBreak = () => {
    const new_break = {
      name: breakName,
      start_date: breakStartDate,
      end_date: breakEndDate,
      user_id: user_id
    };

    /*const response = await fetch(flaskURL + "/add_break", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(new_break)
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
        case 205:
          alert("Break not created!");
          break;
        case 206:
          alert("Missing information!");
          break;
      }
    }*/
    setBreaks([...breaks, new_break])
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
      {showSemesterForm && (
        <form onSubmit={handleSemesterSelection}>
          <label>
            Semester:
            <input
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            />
          </label>
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
          <button type="submit">Submit</button>
        </form>
      )}
      {!showSemesterForm && (
        <div>
          <h2>Semester: {semester}</h2>
          <button onClick={toggleBreakPopup}>Add Break</button>
          <button onClick={toggleCoursePopup}>Add Course</button>
          {showCoursePopup && (
            <AddCoursePopup
              courseName={courseName}
              handleCourseNameChange={handleCourseNameChange}
              courseNumber={courseNumber}
              handleCourseNumberChange={handleCourseNumberChange}
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
                Name: {course.name} | Number: {course.number}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
