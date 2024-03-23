import { useState, useEffect, useRef } from "react";
import "./ChatBox.css";

const generateHTML = (arr, userId) => {
  const keys = Object.keys(arr);
  return keys.map((key) => (
    <p key={key} className={userId == arr[key].type ? "rec":"sent"}>
      {arr[key].string}
    </p>
  ));
};

export default function chatBox(friends, message, userId = 1) {
  const [messageArr, setMessageArr] = useState({
    1: { "string": "string1", "type": 1 },
    2: { "string": "string2", "type": 1 },
    3: { "string": "string3", "type": 2 },
  });

  const [isExpand, setIsExpand] = useState(false);
  const messageEndRef = useRef(null);

  function scroll_buttom() {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scroll_buttom();
  });

  const inputRef = useRef("");

  return (
    <>
      <button
        className="expandButton"
        onClick={() => {
          setIsExpand(!isExpand);
          console.log(isExpand);
        }}
      >
        {isExpand ? "Collapse" : "Expand"}
      </button>
      <div
        className="chat_box_container"
        style={{ display: isExpand ? "flex" : "none" }}
      >
        <div className="chat_box_container2">
          <div className="info">
            <button className="info_button" onClick={() => {}}>
              &lt;
            </button>
            <p>Friends</p>
          </div>

          <div className="messageBox">
            <p className="rec">Hi</p>
            <div>{generateHTML(messageArr, userId)}</div>
            <div ref={messageEndRef} />
          </div>
          <div className="footer">
            <input
              className="footer_input"
              type="text"
              name="h"
              ref={inputRef}
            />
            <button
              className="footer_button"
              onClick={() => {
                console.log("length", Object.keys(messageArr).length);
                if (inputRef.current.value !== "") {
                  setMessageArr((prevState) => ({ ...prevState, [Object.keys(messageArr).length + 1]: { string: inputRef.current.value, type: 1 } }));
                }
                scroll_buttom();
                inputRef.current.value = "";
              }}
            >
              &lt;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
//224 219 211