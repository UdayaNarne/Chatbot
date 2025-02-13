const express = require("express");
const router = express.Router();
const model = require("../services/ai.prompt");
const intentResponses = require("../services/intents.json");

function getJson(response)
{
    const cleanedString = response.replace(/```json|```/g, "").trim();
    const responseObject = JSON.parse(cleanedString);
    return responseObject;
}

router.post("/generate", async (req, res) => {
    const prompt = req.body.prompt;
    const result = await model.generateContent(prompt);
    const response = result.response.text()
    const responseObject = getJson(response);
    
    console.log(responseObject);
    return res.send(responseObject);
});


module.exports = router;