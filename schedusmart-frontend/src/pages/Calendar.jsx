// This document is used for the components of dashboard
import React, {  } from "react";
import "./MainFrame.css";


function todayseeker(today) {
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

export default function Calendar(selectMode) {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const lastDayInt = Math.floor(lastDay.getDate());
  let date = todayseeker(today);
  return (
    <div>
      <div
        className="calender2"
        style={{ display: selectMode === 2 ? "block" : "none" }}
      >
        <p className="weekday" id="weekday1">
          Su.
        </p>
        <p className="weekday" id="weekday2">
          Mo.
        </p>
        <p className="weekday" id="weekday3">
          Tu.
        </p>
        <p className="weekday" id="weekday4">
          We.
        </p>
        <p className="weekday" id="weekday5">
          Th.
        </p>
        <p className="weekday" id="weekday6">
          Fr.
        </p>
        <p className="weekday" id="weekday7">
          Sa.
        </p>
        <div className="dayBox1">
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
        </div>
        <div className="dayBox2">
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
        </div>
        <div className="dayBox3">
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
        </div>
        <div className="dayBox4">
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
        </div>
        <div className="dayBox5">
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
        </div>
        <div className="dayBox6">
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
        </div>
        <div className="dayBox7">
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
        </div>
        <div className="daytimebox">
          <p className="dayWord">1:00</p>
          <p className="dayWord">3:00</p>
          <p className="dayWord">5:00</p>
          <p className="dayWord">7:00</p>
          <p className="dayWord">9:00</p>
          <p className="dayWord">11:00</p>
          <p className="dayWord">13:00</p>
          <p className="dayWord">15:00</p>
          <p className="dayWord">17:00</p>
          <p className="dayWord">19:00</p>
          <p className="dayWord">21:00</p>
          <p className="dayWord">23:00</p>
        </div>
      </div>
      <div
        className="calender1"
        style={{ display: selectMode === 1 ? "block" : "none" }}
      >
        <div className="dayBox">
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
          <hr className="dayLine" />
        </div>
        <div className="daytimebox">
          <p className="dayWord">1:00</p>
          <p className="dayWord">3:00</p>
          <p className="dayWord">5:00</p>
          <p className="dayWord">7:00</p>
          <p className="dayWord">9:00</p>
          <p className="dayWord">11:00</p>
          <p className="dayWord">13:00</p>
          <p className="dayWord">15:00</p>
          <p className="dayWord">17:00</p>
          <p className="dayWord">19:00</p>
          <p className="dayWord">21:00</p>
          <p className="dayWord">23:00</p>
        </div>
      </div>
      <div style={{ display: selectMode === 3 ? "block" : "none" }}>
        <div>
          <table>
            <tr>
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
            </tr>
            <tr>
              <td>{printerForMode3(date, lastDayInt)}</td>
              <td>{printerForMode3(date + 1, lastDayInt)}</td>
              <td>{printerForMode3(date + 2, lastDayInt)}</td>
              <td>{printerForMode3(date + 3, lastDayInt)}</td>
              <td>{printerForMode3(date + 4, lastDayInt)}</td>
              <td>{printerForMode3(date + 5, lastDayInt)}</td>
              <td>{printerForMode3(date + 6, lastDayInt)}</td>
            </tr>
            <tr>
              <td>{printerForMode3(date + 7, lastDayInt)}</td>
              <td>{printerForMode3(date + 8, lastDayInt)}</td>
              <td>{printerForMode3(date + 9, lastDayInt)}</td>
              <td>{printerForMode3(date + 10, lastDayInt)}</td>
              <td>{printerForMode3(date + 11, lastDayInt)}</td>
              <td>{printerForMode3(date + 12, lastDayInt)}</td>
              <td>{printerForMode3(date + 13, lastDayInt)}</td>
            </tr>
            <tr>
              <td>{printerForMode3(date + 14, lastDayInt)}</td>
              <td>{printerForMode3(date + 15, lastDayInt)}</td>
              <td>{printerForMode3(date + 16, lastDayInt)}</td>
              <td>{printerForMode3(date + 17, lastDayInt)}</td>
              <td>{printerForMode3(date + 18, lastDayInt)}</td>
              <td>{printerForMode3(date + 19, lastDayInt)}</td>
              <td>{printerForMode3(date + 20, lastDayInt)}</td>
            </tr>
            <tr>
              <td>{printerForMode3(date + 21, lastDayInt)}</td>
              <td>{printerForMode3(date + 22, lastDayInt)}</td>
              <td>{printerForMode3(date + 23, lastDayInt)}</td>
              <td>{printerForMode3(date + 24, lastDayInt)}</td>
              <td>{printerForMode3(date + 25, lastDayInt)}</td>
              <td>{printerForMode3(date + 26, lastDayInt)}</td>
              <td>{printerForMode3(date + 27, lastDayInt)}</td>
            </tr>
            <tr>
              <td>{printerForMode3(date + 28, lastDayInt)}</td>
              <td>{printerForMode3(date + 29, lastDayInt)}</td>
              <td>{printerForMode3(date + 30, lastDayInt)}</td>
              <td>{printerForMode3(date + 31, lastDayInt)}</td>
              <td>{printerForMode3(date + 32, lastDayInt)}</td>
              <td>{printerForMode3(date + 33, lastDayInt)}</td>
              <td>{printerForMode3(date + 34, lastDayInt)}</td>
            </tr>
            <tr>
              <td>{printerForMode3(date + 35, lastDayInt)}</td>
              <td>{printerForMode3(date + 36, lastDayInt)}</td>
              <td>{printerForMode3(date + 37, lastDayInt)}</td>
              <td>{printerForMode3(date + 38, lastDayInt)}</td>
              <td>{printerForMode3(date + 39, lastDayInt)}</td>
              <td>{printerForMode3(date + 40, lastDayInt)}</td>
              <td>{printerForMode3(date + 41, lastDayInt)}</td>
            </tr>
          </table>
        </div>
      </div>

      <div style={{ display: selectMode === 4 ? "block" : "none" }}>
        <table>
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
