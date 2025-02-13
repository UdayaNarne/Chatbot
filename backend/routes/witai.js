const axios = require("axios");

const API_URL = "https://api.wit.ai/message?v=20250208&q=";
const API_KEY = "Bearer TR6QVDAX2QBEUDDZ73USXROPQFHIH3M7";

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5001;
app.use(cors());
app.use(express.json());

async function queryWit(query) {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: API_KEY,
            },
            params: {
                q: query,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error querying Wit.ai:", error);
        return null;
    }
}

function getDepartmentLink(department) {
    let dept='';
    if(department==="CSE"||department==="Computer Science"){
        dept="cse";
    }
    else if(department==="ECE"||department==="Electronics and Communications Engineering"){
        dept="ece";
    }
    else if(department==="EEE"||department==="Electrical and Electronics Engineering"){
        dept="eee";
    }
    else if(department==="MECH"||department==="Mechanical Engineering"|| department==="Mechanical"){
        dept="mech";
    }
    else if(department==="CIVIL"||department==="Civil Engineering"){
        dept="civil";
    }
    return `<a href="https://gvpce.ac.in/${dept}fac.html" target="_blank">Click here for the Faculty Details of ${department}</a>`;
}



app.post("/api/chat", async (req, res) => {
    const userQuery = req.body.message;
    const response = await queryWit(userQuery);

    if(userQuery.length==1||userQuery.trim().length==0||!userQuery){
        res.json({ response: "No intent detected. Please try again." });
    }
    else if (response) {
        const currentIntent = response.intents?.[0]?.name;

        res.json({ response: intentResponses[currentIntent] || intentResponses.default });
    }else {
        res.status(500).json({ response: "Could not fetch a response from Wit.ai." });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
