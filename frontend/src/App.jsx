import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "User", text: input }];
    setMessages(newMessages);

    try {
      const response = await axios.post("http://localhost:3000/generate", {
        prompt: input,
      });

      let botResponse = "Sorry, I couldn't process that.";
      
      if (response.data && response.data.response) {
        const { text, url } = response.data.response;
        botResponse = (
          <div>
            {text}
            {url && (
              <>
                <br />
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Learn more
                </a>
              </>
            )}
          </div>
        );
      }

      setMessages([...newMessages, { sender: "Bot", text: botResponse }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { sender: "Bot", text: "An error occurred. Please try again." },
      ]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-wrapper">
      {!isChatOpen ? (
        <button className="chat-toggle-btn" onClick={toggleChat}>
          Let's Chat
        </button>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            Chatbot
            <button className="close-btn" onClick={toggleChat}>×</button>
          </div>

          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender.toLowerCase()}`}>
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))}
          </div>

          <div className="input-box">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress} // Submit on Enter
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
