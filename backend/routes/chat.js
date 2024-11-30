const express = require("express");
const router = express.Router();
const Intent = require("../models/intent");

async function getResponse(userMessage) {
    const message = userMessage.toLowerCase();
  const intent = await Intent.findOne({patterns: message});
  if(intent){
    return { response: intent.response, urlLink: intent.url };
  }
  return { response: "I'm not sure I understand. Can you rephrase?", urlLink: "" };
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
