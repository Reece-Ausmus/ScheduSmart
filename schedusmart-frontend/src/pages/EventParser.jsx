import React, { useState, useEffect } from "react";
// Define the Flask API URL
const flaskURL = "http://127.0.0.1:5000";

// user_id to get user info
const userId = sessionStorage.getItem("user_id");

export default function EventParser(event, id_number, boundary) {

    function compareDates(date1, date2) {
        if (date1 > date2) {
            return 1;
        } else if (date1 < date2) {
            return -1;
        } else {
            return 0;
        }
    }
    
    function addDaysToSpecificDate(date, a) {
        const newDate = new Date(date.getTime() + a * 24 * 60 * 60 * 1000);
        return newDate;
    }
    
    function addMonthsToSpecificDate(date, a) {
        const newDate = new Date(
            date.getFullYear(),
            date.getMonth() + a,
            date.getDate() + 1
        );
        return newDate;
    }
    
    function addYearsToSpecificDate(date, a) {
        const newDate = new Date(
            date.getFullYear() + a,
            date.getMonth(),
            date.getDate() + 1
        );
        return newDate;
    }

    const eventArray = [];

    let id = id_number;
    let event_name = event.name;

    const [year1, month1, day1] = event.start_date.split("-").map(Number);
    const [hour1, min1] = event.start_time.split(":").map(Number);
    const [year2, month2, day2] = event.end_date.split("-").map(Number);
    const [hour2, min2] = event.end_time.split(":").map(Number);

    let firstStartDate = new Date(year1, month1 - 1, day1, hour1, min1, 0);
    firstStartDate.setMinutes(
        firstStartDate.getMinutes() - firstStartDate.getTimezoneOffset()
    );
    let firstEndDate = new Date(year2, month2 - 1, day2, hour2, min2, 0);
    firstEndDate.setMinutes(
        firstEndDate.getMinutes() - firstEndDate.getTimezoneOffset()
    );

    let startDate = addDaysToSpecificDate(firstStartDate, 0);
    let endDate = addDaysToSpecificDate(firstEndDate, 0);
    let counter = 1; //Default will add 1

    console.log(event.repetition_type)

    if (event.repetition_type === "daily") {
        while (compareDates(startDate, boundary) == -1) {
            eventArray.push({
                id: id,
                text: event_name,
                start: startDate.toISOString().slice(0, 19),
                end: endDate.toISOString().slice(0, 19),
            });
            id++;
            startDate = addDaysToSpecificDate(firstStartDate, counter);
            endDate = addDaysToSpecificDate(firstEndDate, counter);
            counter++;
        }
    } else if (event.repetition_type === "weekly") {
        counter = 7;
        while (compareDates(startDate, boundary) == -1) {
            eventArray.push({
                id: id,
                text: event_name,
                start: startDate.toISOString().slice(0, 19),
                end: endDate.toISOString().slice(0, 19),
            });
            id++;
            startDate = addDaysToSpecificDate(firstStartDate, counter);
            endDate = addDaysToSpecificDate(firstEndDate, counter);
            counter += 7;
        }
    } else if (event.repetition_type === "monthly") {
        while (compareDates(startDate, boundary) == -1) {
            eventArray.push({
                id: id,
                text: event_name,
                start: startDate.toISOString().slice(0, 19),
                end: endDate.toISOString().slice(0, 19),
            });
            id++;
            startDate = addMonthsToSpecificDate(firstStartDate, counter);
            endDate = addMonthsToSpecificDate(firstEndDate, counter);
            counter++;
        }
    } else if (event.repetition_type === "yearly") {
        while (compareDates(startDate, boundary) == -1) {
            eventArray.push({
                id: id,
                text: event_name,
                start: startDate.toISOString().slice(0, 19),
                end: endDate.toISOString().slice(0, 19),
            });
            id++;
            startDate = addYearsToSpecificDate(firstStartDate, counter);
            endDate = addYearsToSpecificDate(firstEndDate, counter);
            counter++;
        }
    } else if (event.repetition_type === "custom") {
        counter = event.repetition_val;
        while (compareDates(startDate, boundary) == -1) {
            eventArray.push({
                id: id,
                text: event_name,
                start: startDate.toISOString().slice(0, 19),
                end: endDate.toISOString().slice(0, 19),
            });
            id++;
            if (event.repetition_unit === "days") {
                startDate = addDaysToSpecificDate(firstStartDate, counter);
                endDate = addDaysToSpecificDate(firstEndDate, counter);
                counter += event.repetition_val;
            } else if (event.repetition_unit === "weeks") {
                startDate = addDaysToSpecificDate(firstStartDate, 7 * counter);
                endDate = addDaysToSpecificDate(firstEndDate, 7 * counter);
                counter += event.repetition_val;
            } else if (event.repetition_unit === "months") {
                startDate = addMonthsToSpecificDate(firstStartDate, counter);
                endDate = addMonthsToSpecificDate(firstEndDate, counter);
                counter += event.repetition_val;
            } else {
                startDate = addYearsToSpecificDate(firstStartDate, counter);
                endDate = addYearsToSpecificDate(firstEndDate, counter);
                counter += event.repetition_val;
            }
        }
    } else {
        console.log("Error occurs: repetition type not parse correctly");
    }

    return eventArray;
}