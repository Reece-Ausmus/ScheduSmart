import { useState, useEffect } from "react";
import "./ChatBox.css";

export default function chatBox() {
  const [isScrollToBottom, setIsScrollToBottom] = useState(false);

  function scroll_buttom() {
    var messageBox = document.querySelector(".messageBox");
    messageBox.scrollTop = messageBox.scrollHeight;
  }

  return (
    <>
      <div className="chat_box_container">
        <div className="info">
          <button
            className="info_button"
            onClick={() => {
              console.log("I'm");
            }}
          >
            &lqt;
          </button>
          <p>Friends</p>
        </div>

        <div className="messageBox">
          <p className="rec">Hi</p>
          <p className="sent">Hi</p>
          <p className="rec">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto
            culpa sequi praesentium, eos animi iusto, fuga eaque magni repellat
            eum, assumenda odit! Excepturi dolore veritatis aspernatur vitae
            sint. Quos, nesciunt?
          </p>
          <p className="sent">Hi?</p>
          <p className="sent">Hi?</p>
          <p className="sent">Hi?</p>
          <p className="sent">Hi?</p>
          <p className="sent">Hi?</p>
          <p className="sent">Hi?</p>
          <p className="sent">Hi?</p>
          <p className="sent">Hi?</p>
        </div>
        <div className="footer">
          <input className="footer_input" type="text" name="" />
          <button
            className="footer_button"
            onClick={() => {
              console.log("clicked");
              scroll_buttom();
            }}
          >
            SEND
          </button>
        </div>
      </div>
    </>
  );
}
