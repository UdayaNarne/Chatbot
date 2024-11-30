import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: "User", text: input }]);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      const botResponse = response.data.response;
      const urlLink = response.data.urlLink; // Get the single URL from the response

      setMessages((prev) => [
        ...prev,
        { sender: "Bot", text: botResponse, urlLink: urlLink },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "Bot", text: "Sorry, I couldn't process that." },
      ]);
    }

    setInput(""); // Clear input field
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <strong>{msg.sender}:</strong> {msg.text}
            {msg.urlLink && (
              <div className="link">
                <a href={msg.urlLink} target="_blank" rel="noopener noreferrer">
                  {msg.urlLink}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
