import { useState, useEffect, useRef } from "react";
import "./GPTChatBox.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import GPT_API_KEY from "./gpt.api.config";

const API_KEY = GPT_API_KEY;
const flaskURL = "http://127.0.0.1:5000";

export default function GPTChatBox(taskList, userId, language) {
  const [isExpand, setIsExpand] = useState(false);
  const [typing, setTyping] = useState(false);
  const [tabLabel, setTabLabel] = useState("Open Tasky!");
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Tasky! What would you like help with today?",
      sender: "ChatGPT",
      direction: "incoming",
    },
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setTyping(true);

    await processMessageToChatGPT(newMessages);
  };

  const updateChat = async () => {
    const response = await fetch(flaskURL + "/user_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
      }),
      credentials: "include",
    });
    if (!response.ok) {
      alert("Account Info Not Found. Please log-out and log-in again");
    } else {
      switch (response.status) {
        case 201:
          const responseData = await response.json();
          if (
            responseData.chat_log !== null &&
            responseData.chat_log !== undefined
          ) {
            setMessages(responseData.chat_log);
          }
          break;
        case 202:
          alert("List Not Found");
          break;
        case 205:
          alert("Failing to retrieve user data");
          break;
      }
    }
  };

  const saveChat = async (chatMessages) => {
    const info = {
      user_id: userId,
      chat_log: chatMessages,
    };
    const response = await fetch(flaskURL + "/update_chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    });
    if (!response.ok) {
      alert("something went wrong, refresh your website");
    } else {
      switch (response.status) {
        case 201:
          console.log("Updated message list!");
          break;
        case 205:
          console.log("Failed to save message list! Check Connection!");
          break;
        case 206:
          console.log("Failed to save list! Missing info!");
          break;
      }
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });
    let defaultSetup =
      "You are Tasky, a Task Manager assistant. Help the user manage their tasks and nothing more. You cannot change or alter the tasks in anyway. The following system messages are the users current tasks. Priority levels have the following meanings: 0 is unprioritized, 1 is important, 2 is Overdue, 3 is time-sensitive";
    let languageSetting = "";
    if (language == 0) {
      languageSetting = "SPEAK IN ENGLISH ";
    } else if (language == 1) {
      languageSetting = "SPEAK IN CHINESE ";
    } else {
      languageSetting = "SPEAK IN SPANISH ";
    }
    defaultSetup = languageSetting + defaultSetup;

    const systemMessage = {
      role: "system",
      content: defaultSetup,
    };

    const taskMessages = taskList.map((task) => {
      let content = JSON.stringify(task);

      return {
        role: "system",
        content: content,
      };
    });

    apiMessages = [...apiMessages, ...taskMessages];

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
            direction: "incoming",
          },
        ]);
        saveChat([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
            direction: "incoming",
          },
        ]);
        setTyping(false);
      });
  }

  return (
    <>
      <button
        className="expandButton"
        onClick={async () => {
          setTabLabel("Loading...");
          updateChat()
            .then(() => {
              setIsExpand(!isExpand);
            })
            .then(() => {
              setTabLabel(() => {
                return isExpand ? "Open Tasky!" : "Close Tasky.";
              });
            });
        }}
      >
        {tabLabel}
      </button>
      <div
        className="chat_box_container"
        style={{
          display: isExpand ? "flex" : "none",
          height: "400px",
          width: "400px",
        }}
      >
        <MainContainer style={{ width: "150%", height: "100%" }}>
          <ChatContainer>
            <MessageList
              typingIndicator={
                typing ? <TypingIndicator content="Tasky is typing" /> : null
              }
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type Message Here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  );
}
