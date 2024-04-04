import { useState, useEffect, useRef } from "react";
import "./GPTChatBox.css";

export default function GPTChatBox() {
  
  const [isExpand, setIsExpand] = useState(false);

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
        Temp Chat
      </div>
    </>
  );
}
