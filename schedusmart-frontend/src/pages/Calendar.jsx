// This document is used for the components of dashboard
import React from "react";
import "./MainFrame.css";
import { useState, useRef, useEffect } from "react";
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import send_request from "./requester";

function firstDaySeeker(today) {
  let date = today.getDate();
  const day = today.getDay();
  date = date % 7;
  date = day - date + 1;
  date < 0 ? (date += 7) : date;
  return 1 - date;
}

function printerForMode3(date, lastDayInt) {
  return date > 0 && date <= lastDayInt ? date : null;
}

function dayComparison(day1, day2) {
  if (typeof day1 == String) {
    let parse_day1 =
      day1.substring(0, 4) + day1.substring(5, 7) + day1.substring(8);
    day1 = parseInt(parse_day1);
  }

  if (typeof day2 == String) {
    let parse_day2 =
      day2.substring(0, 4) + day2.substring(5, 7) + day2.substring(8);
    day2 = parseInt(parse_day2);
  }

  if (day1 < day2) return -1;
  else if (day1 == day2) return 0;
  else return 1;
}

function addDaysToSpecificDate(dateString, a) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format. Please use "XXXX-XX-XX" format.');
  }
  
  const newDate = new Date(date.getTime() + a * 24 * 60 * 60 * 1000);
  return newDate.toISOString().split('T')[0];
}

function eventParser(event, id_number) {
  event_name = event.name;
  console.log("id: " + String(id_number));
  return {
    id: 2,
    text: "Event 1",
    start: "2023 10-02 10:30:00",
    end: "2023-10-02 13:00:00",
  }
}



async function events_array_generator(calendar_id) {
  let events = await send_request("/get_events", { calendar_id: calendar_id });
  if (events.data == undefined) return;
  console.log("length:" + String(events.data.length));
  const arrayEvents = [];
  for (let i = 0; i < events.data.length; i++) {
    arrayEvents.push(eventParser(events.data[i], arrayEvents.length));
  }
}

export default function Calendar(selectMode) {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const isoToday = today.toISOString();
  const todayString = isoToday.slice(0, 10);

  const lastDayInt = Math.floor(lastDay.getDate());
  let date = firstDaySeeker(today);

  events_array_generator("15e1c4a5f82eeca0a8a57e19bdea4ea5"); //15e1c4a5f82eeca0a8a57e19bdea4ea5
  const calendarRef = useRef();

  useEffect(() => {
    calendarRef.current.control.update({
      startDate: todayString,
      events: [
        {
          id: 2,
          text: "Event 1",
          start: "2023 10-02 10:30:00",
          end: "2023-10-02 13:00:00",
        },
      ],
    });
  }, []);

  return (
    <div className="sub_main_calnedar_box">
      <button
        onClick={() => {
          console.log(dayComparison("2024-10-30", 20));
        }}
      >
        test_purpose
      </button>

      <div style={{ display: selectMode === 1 ? "block" : "none" }}>
        <DayPilotCalendar {...{ viewType: "Day" }} ref={calendarRef} />
      </div>
      <div style={{ display: selectMode === 2 ? "block" : "none" }}>
        <DayPilotCalendar {...{ viewType: "Week" }} />
      </div>

      <div style={{ display: selectMode === 3 ? "block" : "none" }}>
        <div>
          <table className="month_table">
            <tr>
              <th className="head_month_box">Sun</th>
              <th className="head_month_box">Mon</th>
              <th className="head_month_box">Tue</th>
              <th className="head_month_box">Wed</th>
              <th className="head_month_box">Thu</th>
              <th className="head_month_box">Fri</th>
              <th className="head_month_box">Sat</th>
            </tr>
            <tr>
              <td className="body_month_box">
                {printerForMode3(date, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 1, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 2, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 3, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 4, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 5, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 6, lastDayInt)}
              </td>
            </tr>
            <tr>
              <td className="body_month_box">
                {printerForMode3(date + 7, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 8, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 9, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 10, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 11, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 12, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 13, lastDayInt)}
              </td>
            </tr>
            <tr>
              <td className="body_month_box">
                {printerForMode3(date + 14, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 15, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 16, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 17, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 18, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 19, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 20, lastDayInt)}
              </td>
            </tr>
            <tr>
              <td className="body_month_box">
                {printerForMode3(date + 21, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 22, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 23, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 24, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 25, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 26, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 27, lastDayInt)}
              </td>
            </tr>
            <tr>
              <td className="body_month_box">
                {printerForMode3(date + 28, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 29, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 30, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 31, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 32, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 33, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 34, lastDayInt)}
              </td>
            </tr>
            <tr>
              <td className="body_month_box">
                {printerForMode3(date + 35, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 36, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 37, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 38, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 39, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 40, lastDayInt)}
              </td>
              <td className="body_month_box">
                {printerForMode3(date + 41, lastDayInt)}
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div style={{ display: selectMode === 4 ? "block" : "none" }}>
        <table className="month_table">
          <tr className="MonthBoxFor4">
            <td className="MonthBoxFor4">January</td>
            <td className="MonthBoxFor4">Febuary</td>
            <td className="MonthBoxFor4">March</td>
            <td className="MonthBoxFor4">April</td>
          </tr>
          <tr className="MonthBoxFor4">
            <td className="MonthBoxFor4">May</td>
            <td className="MonthBoxFor4">June</td>
            <td className="MonthBoxFor4">July</td>
            <td className="MonthBoxFor4">August</td>
          </tr>
          <tr className="MonthBoxFor4">
            <td className="MonthBoxFor4">September</td>
            <td className="MonthBoxFor4">October</td>
            <td className="MonthBoxFor4">November</td>
            <td className="MonthBoxFor4">December</td>
          </tr>
        </table>
      </div>
    </div>
  );
}
