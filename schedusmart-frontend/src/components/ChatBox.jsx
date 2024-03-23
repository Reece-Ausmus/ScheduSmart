import { useState, useEffect, useRef} from "react";
import "./ChatBox.css";

export default function chatBox() {
  const [isScrollToBottom, setIsScrollToBottom] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const messageEndRef = useRef(null);
  const [input, setInput] = useState("");

  function scroll_buttom() {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scroll_buttom();
  });

  const inputRef = useRef("");

  return (
    <>
      <button className="expandButton" onClick={ () => {
        setIsExpand(!isExpand);
        console.log(isExpand);
      }}>{isExpand ? "Collapse" : "Expand"}</button>
      <div className="chat_box_container2" style={{ display: isExpand ? "flex" : "none" }}>
        <div className="info">
          <button
            className="info_button"
            onClick={() => {

            }}
          >&lt;
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
          <div ref={messageEndRef} />
        </div>
        <div className="footer">
          <input className="footer_input" type="text" name="h" ref={inputRef}/>
          <button
            className="footer_button"
            onClick={() => {
              scroll_buttom();
              console.log(inputRef.current.value);
              inputRef.current.value = "";
            }}
          >
            SEND
          </button>
        </div>
      </div>
    </>
  );
}
