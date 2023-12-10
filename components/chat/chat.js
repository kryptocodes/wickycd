import React, { useState } from "react";

import { useAccount } from 'wagmi'

const styles = ` 
.Chat{
    background-color: white;
    margin: 0;
    color:black;
    padding: 0;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    height: 100vh;
    width:100%;
    justify-content: center;
    margin: 0;
  }
  
  .messageContainer {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-start;
  }
  
  .inputContainer {
    display: flex;
    align-items: center;
    padding: 10px;
    border-top: 1px solid #ccc;
  }
  
  .inputField {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    color: #555;
    box-sizing: border-box;
  }
  
  .sendButton {
    background-color: #f7f7f7;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 12px;
    font-size: 16px;
    color: #555;
    cursor: pointer;
    margin-left: 10px;
    outline: none;
  }
  
  .sendButton:active {
    background-color: #e5e5e5;
  }
  
  .selectedMessage {
    background-color: black;
    color:white
  }
  .eyes{
    align-items: center;
    font-size: 12px;
    cursor: pointer;
  }
  .date{
    color:grey;
    font-size: 12px;;
  }`

function Chat({ client, messageHistory, conversation, setShowContactList, selectedContact }) {
  const { address } = useAccount()
  const [inputValue, setInputValue] = useState("");

  // Function to handle sending a message
  const handleSend = async () => {
    if (inputValue) {
      await onSendMessage(inputValue);
      setInputValue("");
    }
  };

  // Function to handle sending a text message
  const onSendMessage = async (value) => {
    return conversation.send(value);
  };

  // MessageList component to render the list of messages
  const MessageList = ({ messages }) => {
    // Filter messages by unique id
    messages = messages.filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
    );

  const getUserName = (message) => {
    if(message.senderAddress === address) {
      return "You"
    } else if(selectedContact && selectedContact.profileName !== "No web3 profile") {
      return selectedContact.profileName
    } else if(selectedContact && selectedContact.address) {
      return selectedContact.address
    } else {
      return 
    }    
  }

    return (
      <ul className="messageList">
        {messages.map((message, index) => (
          <li
            key={message.id}
            className="messageItem"
            title="Click to log this message to the console">
            <strong>
              {getUserName(message)}:
            </strong>
            <span>{message.content}</span>
            <span className="date"> ({message.sent.toLocaleTimeString()})</span>
            <span className="eyes" onClick={() => console.log(message)}>
              👀
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // Function to handle input change (keypress or change event)
  const handleInputChange = (event) => {
    if (event.key === "Enter") {
      handleSend();
    } else {
      setInputValue(event.target.value);
    }
  };
  return (
    <div className={styles.Chat}>
      <button onClick={() => setShowContactList(true)} className={styles.backButton}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <div className={styles.messageContainer}>
        <MessageList messages={messageHistory} />
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.inputField}
          onKeyPress={handleInputChange}
          onChange={handleInputChange}
          value={inputValue}
          placeholder="Type your text here "
        />
        <button className={styles.sendButton} onClick={handleSend}>
          &#128073;
        </button>
      </div>
    </div>
  );
}

export default Chat;