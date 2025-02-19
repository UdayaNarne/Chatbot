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
    
    console.log(responseObject)

    const currentIntent = responseObject.intent
    
    if(currentIntent===`syllabus`) {
        const {department, degree, batch,regulation} = responseObject.entities
        if(department && regulation){
            let yr = Number(regulation)
            let syllabusURL = `https://gvpce.ac.in/${department}btechcoustu${yr}-${yr+1}.html`
            intentResponses[currentIntent].url = syllabusURL
            intentResponses[currentIntent].text = `Here is the syllabus for ${department} department course of R-${regulation}`
        }
        else if(degree && batch) {
            let yr = Number(batch)
            let syllabusURL = `https://gvpce.ac.in/${degree}regsyl${yr}-${yr+1}.html`
            //console.log(syllabusURL)
            intentResponses[currentIntent].url = syllabusURL
            intentResponses[currentIntent].text = `Here is the syllabus for ${department} department ${degree} course of ${batch} admitted batch`
        }
        else{
            intentResponses[currentIntent].url = `https://gvpce.ac.in/RegulationSyllabi.html`
            intentResponses[currentIntent].text = `Here is the syllabus for all departments for all courses.For a specific department, degree, regulation and batch, please provide all those details` 
        }
    }
    
    else if(currentIntent===`get_faculty_details`){
        const {department} = responseObject.entities
        if(department) {
            if(department === 'cse' || department === 'aimlcse' || department === 'ds') {
                intentResponses[currentIntent].url = `https://www.gvpce.ac.in/csefac.html`
                intentResponses[currentIntent].text = `Here are the details of ${department}`
            }
            else{
                intentResponses[currentIntent].url = `https://www.gvpce.ac.in/${department}fac.html`
                intentResponses[currentIntent].text = `Here are the faculty details of ${department} department`
            }
        }
        else{
            intentResponses[currentIntent].url = `https://www.gvpce.ac.in/`
            intentResponses[currentIntent].text = `Please provide the department name`
        }
    }

    return res.json({ response: intentResponses[currentIntent] });

});


module.exports = router;


// "medical": "https://www.gvpce.ac.in/medfac.html",
//         "hostel": "https://www.gvpce.ac.in/hostel.html",
//         "transport": "https://www.gvpce.ac.in/transport.html",
//         "labs": "https://www.gvpce.ac.in/laboratories.html"