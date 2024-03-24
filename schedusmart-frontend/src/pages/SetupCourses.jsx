import React, { useState } from 'react';
import { flaskURL, user_id } from '../config';


export default function SetupCourses() {
    const [courses, setCourses] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [courseNumber, setCourseNumber] = useState('');
    const [location, setLocation] = useState('');
    const [schedule, setSchedule] = useState('');
    const [semester, setSemester] = useState('');

    const addCourse = () => {
        const newCourse = {
            user_id,
            courseName,
            courseNumber,
            location,
            schedule
        };

        setCourses([...courses, newCourse]);
        setCourseName('');
        setCourseNumber('');
        setLocation('');
        setSchedule('');

        fetch(flaskURL + '/add_course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCourse)
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the backend
            console.log(data);
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
    };

    const [showForm, setShowForm] = useState(false);

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div>
            <h1>Add Courses</h1>
            <label>
                Semester:
                <input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                />
            </label>
            {showForm && (
                <div>
                    <button onClick={toggleForm}>New Course</button>
                    <form onSubmit={addCourse}>
                        <label>
                            Course Name:
                            <input
                                type="text"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Course Number:
                            <input
                                type="text"
                                value={courseNumber}
                                onChange={(e) => setCourseNumber(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Location:
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Schedule:
                            <input
                                type="text"
                                value={schedule}
                                onChange={(e) => setSchedule(e.target.value)}
                            />
                        </label>
                        <br />
                        <button type="submit">Add Course</button>
                    </form>
                </div>
            )}
            <h2>Added Courses:</h2>
            <ul>
                {courses.map((course, index) => (
                    <li key={index}>
                        {course.courseName} - {course.courseNumber} - {course.location} - {course.schedule}
                    </li>
                ))}
            </ul>
        </div>
    );
};
