import { useState, useEffect, useRef } from "react";
import "./GPTChatBox.css";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"
import GPT_API_KEY from "./gpt.api.config"


export default function GPTChatBox(taskList, userId) {

  const API_KEY = GPT_API_KEY;
  const flaskURL = "http://127.0.0.1:5000";
 
  const [isExpand, setIsExpand] = useState(false);
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Tasky! What would you like help with today?",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage]

    setMessages(newMessages)

    setTyping(true);

    await processMessageToChatGPT(newMessages)
  }

  const saveChat = async () => {
    console.log(messages);
    const info = {
      user_id: userId,
      chat_log: messages,
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
      let role = ""
      if(messageObject.sender === "ChatGPT") {
        role = "assistant"
      } else {
        role = "user"
      }
      return { role: role, content: messageObject.message }
    });

    const systemMessage = {
      role: "system",
      content: "You are Tasky, a Task Manager assistant. Help the user manage their tasks and nothing more. You cannot change or alter the tasks in anyway. The following messages are the users current tasks. Priority levels have the following meanings: 0 is unprioritized, 1 is important, 2 is Overdue, 3 is time-sensitive"
    }

    const taskMessages = taskList.map((task) => {
      let content = JSON.stringify(task)

      return {
        role: "system",
        content: content,
      }
    })

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage, ...taskMessages,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: "incoming"
        }]
      );
      setTyping(false)
    }).then(saveChat)
  }

  return (
    <>
      <button
        className="expandButton"
        onClick={() => {
          setIsExpand(!isExpand);
          console.log(isExpand);
        }}
      >
        {isExpand ? "Close Tasky." : "Open Tasky!"}
      </button>
      <div
        className="chat_box_container"
        style={{ display: isExpand ? "flex" : "none", height: "400px", width: "400px" }}
      >
        <MainContainer style={{width: "150%", height: "100%"}}>
          <ChatContainer>
            <MessageList 
              typingIndicator={typing ? <TypingIndicator content="Tasky is typing" /> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message}/>
              })}
            </MessageList>
            <MessageInput placeholder='Type Message Here' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  );
}
