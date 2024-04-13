import { useState, useEffect, useRef } from "react";
import "./GPTChatBox.css";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"


export default function GPTChatBox() {

  const API_KEY = "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"
  
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
      content: "You are Tasky, a Task Manager assistant. Help the user manage and prioritize their tasks and nothing more."
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
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
    })
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
        {isExpand ? "Close Tasky :(" : "Open Tasky!"}
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
