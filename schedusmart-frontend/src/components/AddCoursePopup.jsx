export default function AddCoursePopup({
  courseName,
  handleCourseNameChange,
  courseNumber,
  handleCourseNumberChange,
  courseDescription,
  handleCourseDescriptionChange,
  courseStartTime,
  handleCourseStartTimeChange,
  courseEndTime,
  handleCourseEndTimeChange,
  courseSelectedDays,
  handleCourseDayToggle,
  courseLocation,
  handleCourseLocationChange,
  handleCreateCourse,
  toggleCoursePopup
}) {
  return (
    <div className="popup">
      <label>test</label>
      <div className="popup-content">
        <h2>Add Course</h2>
        <div>
          <div className="formgroup">
            <label htmlFor="courseName">Course Name:</label>
            <input
              type="text"
              id="courseName"
              value={courseName}
              onChange={handleCourseNameChange}
            />
          </div>
          <div className="formgroup">
            <label htmlFor="courseNumber">Course Number:</label>
            <input
              type="text"
              id="courseNumber"
              value={courseNumber}
              onChange={handleCourseNumberChange}
            />
          </div>
          <div className="formgroup">
            <label htmlFor="courseLocation">Course Location:</label>
            <input
              type="text"
              id="courseLocation"
              value={courseLocation}
              onChange={handleCourseLocationChange}
            />
          </div>
          <div className="formgroup">
            <label htmlFor="courseDescription">Course Description:</label>
            <textarea
              id="courseDescription"
              value={courseDescription}
              onChange={handleCourseDescriptionChange}
              rows="4"
              cols="50"
            />
          </div>
          <div className="formgroup">
            <label htmlFor="courseStartTime">Start Time:</label>
            <input
              type="time"
              id="courseStartTime"
              value={courseStartTime}
              onChange={handleCourseStartTimeChange}
            />
            <label htmlFor="courseEndTime">End Time:</label>
            <input
              type="time"
              id="courseEndTime"
              value={courseEndTime}
              onChange={handleCourseEndTimeChange}
            />
          </div>
          <div className="course-repetition-form">
            <h2>Course Repetition</h2>

            <div className="custom-repetition">
              <div className="day-selector">
                <p>Select specific days:</p>
                <label>
                  <input
                    type="checkbox"
                    checked={courseSelectedDays.includes("mon")}
                    onChange={() => handleCourseDayToggle("mon")}
                  />
                  Monday
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={courseSelectedDays.includes("tues")}
                    onChange={() => handleCourseDayToggle("tues")}
                  />
                  Tuesday
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={courseSelectedDays.includes("wed")}
                    onChange={() => handleCourseDayToggle("wed")}
                  />
                  Wednesday
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={courseSelectedDays.includes("thur")}
                    onChange={() => handleCourseDayToggle("thur")}
                  />
                  Thursday
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={courseSelectedDays.includes("fri")}
                    onChange={() => handleCourseDayToggle("fri")}
                  />
                  Friday
                </label>
              </div>
            </div>
          </div>
          <button className="formbutton fb1" onClick={handleCreateCourse()}>
            Add
          </button>
          <button className="formbutton fb2" onClick={toggleCoursePopup()}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
