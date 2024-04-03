import { useState, useEffect, useRef } from "react";
import "./GPTChatBox.css";
import seachIcon from "./search-interface-symbol.png";


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
        {isExpand ? "Collapse" : "Expand"}
      </button>
      <div
        className="chat_box_container"
        style={{ display: isExpand ? "flex" : "none" }}
      >
        This is the chat box
      </div>
    </>
  );
}
