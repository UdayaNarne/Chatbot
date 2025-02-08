const axios = require("axios");

const API_URL = "https://api.wit.ai/message?v=20241217&q=";
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
    if(department==="cse"||department==="computer science"){
        dept="cse";
    }
    else if(department==="ece"||department==="electronics and communications engineering"){
        dept="ece";
    }
    else if(department==="eee"||department==="electrical and electronics engineering"){
        dept="eee";
    }
    else if(department==="mech"||department==="mechanical engineering"|| department==="mechanical"){
        dept="mech";
    }
    else if(department==="civil"||department==="civil engineering"){
        dept="civil";
    }
    return `Click here for the Faculty Details of ${department} https://gvpce.ac.in/${dept}fac.html`;
}

const intentResponses = {
    get_admission_details: "To apply for admission, you'll need a Rank Card,Allotment Cards, transcripts, and an application form.",
    faculty_details:"You can find the details of the faculty in your department. Please specify the department.",
    default: "Sorry, I don't understand your query. Can you please rephrase it?",
    placements:"You can find the details of the TnP at https://www.gvpce.ac.in/campusplace.html",
};


app.post("/api/chat", async (req, res) => {
    const userQuery = req.body.message;
    const response = await queryWit(userQuery);
    
    if(userQuery.length==1||userQuery.trim().length==0||!userQuery){
        res.json({ response: "No intent detected. Please try again." });
    }

    else if (response) {
            console.log(response);
            const detectedIntents = response.intents;
            console.log('\n',response.entities);

            // Get the name of the detected intent, if available
            const detectedIntent = detectedIntents.length > 0 ? detectedIntents[0].name : null;

            // Safely extract the 'department' entity value if it exists, otherwise default to null
            const department = response.entities['department:department'] ? response.entities['department:department'][0].value : null;

            if (detectedIntent==="faculty_dept_no") {
                if(department){
                    const departmentLink=getDepartmentLink(department);
                    res.json({ response: `You can find the details of the faculty in your department at ${departmentLink}` });
                }
                else{
                    res.json({ response:intentResponses.faculty_dept_no});
                }
            }

            else if(detectedIntent){
                const reply = intentResponses[detectedIntent] || intentResponses.default;
                res.json({ response:reply});
            }
            else {
                res.json({ response: "Intent not defined" });
            }
    } 
    else {
        res.status(500).json({ response: "Could not fetch a response from Wit.ai." });
    }

});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
