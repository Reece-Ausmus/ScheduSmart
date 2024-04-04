import { useState, useEffect, useRef } from "react";
import "./GPTChatBox.css";
import seachIcon from "./search-interface-symbol.png";


export default function GPTChatBox() {
  
  const [isExpand, setIsExpand] = useState(false);
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState(["new message", "hello new message", "new message"]);

  return (
    <>
      <button
        className="expandButton"
        onClick={() => {
          setIsExpand(!isExpand);
          console.log(isExpand);
        }}
      >
        {isExpand ? "Close ChatBot." : "Open ChatBot!"}
      </button>
      <div
        className="chat_box_container"
        style={{ display: isExpand ? "flex" : "none" }}
      >
        <div>
          {messageHistory.map((chat) => {
            chat[0]
          })}
        </div>
        <div>
          <input
            type="text"
            value={message}
            onChange={(e) => {setMessage(e.target.value)}}
          />
          <button onClick={() => {
            setMessageHistory([...messageHistory, message]);
            setMessage("")
            console.log(messageHistory)
          }}>{"=>"}</button>
        </div>
      </div>
    </>
  );
}
