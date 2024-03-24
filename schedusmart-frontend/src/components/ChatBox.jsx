import { useState, useEffect, useRef } from "react";
import "./ChatBox.css";
import seachIcon from "./search-interface-symbol.png";


export default function chatBox(friends, message, userId = 1) {
  
  const [messageArr, setMessageArr] = useState({
    1: { string: "string1", type: 1 },
    2: { string: "string2", type: 1 },
    3: { string: "string3", type: 2 },
  });
  const [friendList, setFriendList] = useState({
    1: { userName: "stan", room: "C6H12O6" },
    2: { userName: "steve", room: "CH2OH" },
    3: { userName: "vivi", room: "CH4" },
  });

  const [isExpand, setIsExpand] = useState(false);
  const [selectFriend, setSelectFriend] = useState(null);
  const messageEndRef = useRef(null);

  const scroll_buttom = () => {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
  const generateFriendListHTML = (arr) => {
    if (!arr) {
      return;
    }
    const keys = Object.keys(arr);
    return keys.map((key) => (
      <div key={key} className="friendBar" onClick={()=>{
        console.log(friendList[key].room);
        setSelectFriend(friendList[key].room);
      }}>
        <p className="friend">
          {arr[key].userName}
        </p>
        <button className="control">+</button>
      </div>
    ));
  };

  const generateMessageHTML = (arr, userId) => {
    const keys = Object.keys(arr);
    return keys.map((key) => (
      <p key={key} className={userId == arr[key].type ? "rec" : "sent"}>
        {arr[key].string}
      </p>
    ));
  };

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
        <div
          className="chat_box_container1"
          style={{ display: selectFriend ? "none" : "flex" }}
        >
          <div className="info"></div>
          <div className="friendSearch">
            <input
              placeholder="Search"
              className="friendSearchInput"
              type="text"
            />
            <img
              className="friendSearchButton"
              src={seachIcon}
              onClick={() => {
                console.log("the search is activated");
              }}
            />
          </div>
          <div className="friendList">
            <div>{generateFriendListHTML(friendList)}</div>
          </div>
        </div>

        <div
          className="chat_box_container2"
          style={{ display: selectFriend ? "flex" : "none" }}
        >
          <div className="info">
            <button className="info_button" onClick={() => {setSelectFriend(null)}}>
              &lt;
            </button>
            <p>Friends</p>
          </div>

          <div className="messageBox">
            <p className="rec">Hi</p>
            <div>{generateMessageHTML(messageArr, userId)}</div>
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
                  setMessageArr((prevState) => ({
                    ...prevState,
                    [Object.keys(messageArr).length + 1]: {
                      string: inputRef.current.value,
                      type: 1,
                    },
                  }));
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
