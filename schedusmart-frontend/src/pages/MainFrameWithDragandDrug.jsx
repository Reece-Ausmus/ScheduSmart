import { useState } from "react";
import "./MainFrame.css";

export default function MainFrame() {
  function todayseeker() {
    let date = today.getDate();
    const day = today.getDay();
    date = date % 7;
    date = day - date + 1;
    date < 0 ? (date += 7) : date;
    return 1 - date;
  }

  function printerForMode3(date) {
    return date > 0 && date <= lastDayInt ? date : null;
  }

  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const todayMonth = today.getMonth();
  const monthArray = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const todayYear = today.getFullYear();
  const lastDayInt = Math.floor(lastDay.getDate());
  let date = todayseeker();

  const [detailInfo, setDetailInfo] = useState(
    String(today.getMonth()) + "/" + String(today.getDate())
  );

  const [selectMode, setSelectMode] = useState(1);

  return (
    <div className="container">
      <div className="upperBar">
        <h1 className="title">ScheduSmart</h1>
        <button className="upperBarButton">setting</button>
        <button className="upperBarButton">drag & drug</button>
        <button className="upperBarButton">logout</button>
      </div>
      <div className="calender_container">
        <div className="calender_container_controlbar">
          <h2 className="detailInfo">{detailInfo}</h2>
          <button
            className="modeButton"
            id="4"
            onClick={() => {
              setSelectMode(4);
              document.getElementById("1").style.backgroundColor = "#2d2d2d";
              document.getElementById("2").style.backgroundColor = "#2d2d2d";
              document.getElementById("3").style.backgroundColor = "#2d2d2d";
              document.getElementById("4").style.backgroundColor = "#cfcfcf";
              setDetailInfo(todayYear);
            }}
          >
            year
          </button>

          <button
            className="modeButton"
            id="3"
            onClick={() => {
              setSelectMode(3);
              document.getElementById("1").style.backgroundColor = "#2d2d2d";
              document.getElementById("2").style.backgroundColor = "#2d2d2d";
              document.getElementById("3").style.backgroundColor = "#cfcfcf";
              document.getElementById("4").style.backgroundColor = "#2d2d2d";
              setDetailInfo(monthArray[todayMonth - 1]);
            }}
          >
            month
          </button>

          <button
            className="modeButton"
            id="2"
            onClick={() => {
              setSelectMode(2);
              document.getElementById("1").style.backgroundColor = "#2d2d2d";
              document.getElementById("2").style.backgroundColor = "#cfcfcf";
              document.getElementById("3").style.backgroundColor = "#2d2d2d";
              document.getElementById("4").style.backgroundColor = "#2d2d2d";
              setDetailInfo(
                String(today.getMonth()) + "/" + String(today.getDate())
              );
            }}
          >
            week
          </button>

          <button
            className="modeButton"
            id="1"
            onClick={() => {
              setSelectMode(1);
              document.getElementById("1").style.backgroundColor = "#cfcfcf";
              document.getElementById("2").style.backgroundColor = "#2d2d2d";
              document.getElementById("3").style.backgroundColor = "#2d2d2d";
              document.getElementById("4").style.backgroundColor = "#2d2d2d";
              setDetailInfo(
                String(today.getMonth()) + "/" + String(today.getDate())
              );
            }}
          >
            day
          </button>
        </div>
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
                  <td>{printerForMode3(date)}</td>
                  <td>{printerForMode3(date + 1)}</td>
                  <td>{printerForMode3(date + 2)}</td>
                  <td>{printerForMode3(date + 3)}</td>
                  <td>{printerForMode3(date + 4)}</td>
                  <td>{printerForMode3(date + 5)}</td>
                  <td>{printerForMode3(date + 6)}</td>
                </tr>
                <tr>
                  <td>{printerForMode3(date + 7)}</td>
                  <td>{printerForMode3(date + 8)}</td>
                  <td>{printerForMode3(date + 9)}</td>
                  <td>{printerForMode3(date + 10)}</td>
                  <td>{printerForMode3(date + 11)}</td>
                  <td>{printerForMode3(date + 12)}</td>
                  <td>{printerForMode3(date + 13)}</td>
                </tr>
                <tr>
                  <td>{printerForMode3(date + 14)}</td>
                  <td>{printerForMode3(date + 15)}</td>
                  <td>{printerForMode3(date + 16)}</td>
                  <td>{printerForMode3(date + 17)}</td>
                  <td>{printerForMode3(date + 18)}</td>
                  <td>{printerForMode3(date + 19)}</td>
                  <td>{printerForMode3(date + 20)}</td>
                </tr>
                <tr>
                  <td>{printerForMode3(date + 21)}</td>
                  <td>{printerForMode3(date + 22)}</td>
                  <td>{printerForMode3(date + 23)}</td>
                  <td>{printerForMode3(date + 24)}</td>
                  <td>{printerForMode3(date + 25)}</td>
                  <td>{printerForMode3(date + 26)}</td>
                  <td>{printerForMode3(date + 27)}</td>
                </tr>
                <tr>
                  <td>{printerForMode3(date + 28)}</td>
                  <td>{printerForMode3(date + 29)}</td>
                  <td>{printerForMode3(date + 30)}</td>
                  <td>{printerForMode3(date + 31)}</td>
                  <td>{printerForMode3(date + 32)}</td>
                  <td>{printerForMode3(date + 33)}</td>
                  <td>{printerForMode3(date + 34)}</td>
                </tr>
                <tr>
                  <td>{printerForMode3(date + 35)}</td>
                  <td>{printerForMode3(date + 36)}</td>
                  <td>{printerForMode3(date + 37)}</td>
                  <td>{printerForMode3(date + 38)}</td>
                  <td>{printerForMode3(date + 39)}</td>
                  <td>{printerForMode3(date + 40)}</td>
                  <td>{printerForMode3(date + 41)}</td>
                </tr>
              </table>
            </div>
          </div>

          <div style={{ display: selectMode === 4 ? "block" : "none" }}>
            <table>
              <tr class="MonthBoxFor4">
                <td class="MonthBoxFor4">January</td>
                <td class="MonthBoxFor4">Febuary</td>
                <td class="MonthBoxFor4">March</td>
                <td class="MonthBoxFor4">April</td>
              </tr>
              <tr class="MonthBoxFor4">
                <td class="MonthBoxFor4">May</td>
                <td class="MonthBoxFor4">June</td>
                <td class="MonthBoxFor4">July</td>
                <td class="MonthBoxFor4">August</td>
              </tr>
              <tr class="MonthBoxFor4">
                <td class="MonthBoxFor4">September</td>
                <td class="MonthBoxFor4">October</td>
                <td class="MonthBoxFor4">November</td>
                <td class="MonthBoxFor4">December</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div className="event_container">
        <h1 className="Event_title">Assignment List</h1>
        <div className="ToDoList"></div>
      </div>
    </div>
  );
}
