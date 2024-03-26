import React, { useState } from "react";
import { flaskURL, user_id } from "../config";
import AddCoursePopup from "../components/AddCoursePopup";

export default function SetupCourses() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseStartTime, setCourseStartTime] = useState("");
  const [courseEndTime, setCourseEndTime] = useState("");
  const [courseSelectedDays, setCourseSelectedDays] = useState([]);
  const [courseLocation, setCourseLocation] = useState("");
  const [semester, setSemester] = useState("");
  const [semesterStartDate, setSemesterStartDate] = useState("");
  const [semesterEndDate, setSemesterEndDate] = useState("");
  const [showSemester, setShowSemester] = useState(true);
  const [showCoursePopup, setShowCoursePopup] = useState(false);

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

  const handleSemesterSelection = (e) => {
    e.preventDefault();
    //TODO: validate inputs
    setShowSemester(!showSemester);
    toggleCoursePopup();
  };

  const toggleCoursePopup = () => {
    setShowCoursePopup(!showCoursePopup);
  };

  const handleSemesterStartDateChange = (e) => {
    setSemesterStartDate(e.target.value);
  };

  const handleSemesterEndDateChange = (e) => {
    setSemesterEndDate(e.target.value);
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

  return (
    <div>
      <h1>Setup Courses</h1>
      {showSemester && (
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
      <h2>Added Courses:</h2>
      <ul>
        {courses.map((course, index) => (
          <li key={index}>
            {course.courseName} - {course.courseNumber} - {course.location} -{" "}
          </li>
        ))}
      </ul>
    </div>
  );
}
