import React, { useState } from "react";

function Chat({ client, messageHistory, conversation }) {
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
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );

    return (
      <ul className="messageList">
        {messages.map((message, index) => (
          <li
            key={message.id}
            className="messageItem"
            title="Click to log this message to the console"
          >
            <strong>
              {message.senderAddress === client.address ? "You" : "Bot"}:
            </strong>
            <span>{message.content}</span>
            <span className="date"> ({message.sent.toLocaleTimeString()})</span>
            <span
              className="eyes cursor-pointer"
              onClick={() => console.log(message)}
            >
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
    <div className="flex flex-col h-screen w-full justify-center">
      <div className="flex-1 overflow-y-auto p-10 flex flex-col-reverse items-start">
        <MessageList messages={messageHistory} />
      </div>
      <div className="flex items-center p-10 border-t border-gray-300">
        <input
          type="text"
          className="w-full p-2 text-base border rounded-md outline-none text-gray-500"
          onKeyPress={handleInputChange}
          onChange={handleInputChange}
          value={inputValue}
          placeholder="Type your text here"
        />
        <button
          className="bg-gray-200 border border-gray-300 rounded-md p-2 text-base text-gray-500 cursor-pointer ml-4 outline-none"
          onClick={handleSend}
        >
          &#128073;
        </button>
      </div>
    </div>
  );
}

export default Chat;
