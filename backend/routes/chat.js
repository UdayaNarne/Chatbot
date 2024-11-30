const express = require("express");
const router = express.Router();
const Intent = require("../models/intent");

// Function to match user input with patterns from the database
async function getResponse(userMessage) {
    const message = userMessage.toLowerCase(); // Convert user message to lowercase
  const intent = await Intent.findOne({patterns: message}); // Fetch all intents from the DB
  if(intent){
    return { response: intent.response, urlLink: intent.url }; // Return response
  }
  return { response: "I'm not sure I understand. Can you rephrase?", urlLink: "" }; // Default response with no URL
}

// Chat API endpoint
router.post("/", async (req, res) => {
  const userMessage = req.body.message;
  try {
    const botResponse = await getResponse(userMessage);
    res.json(botResponse);
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({ response: "Internal server error." });
  }
});

module.exports = router;
