const readline = require("readline");
const axios = require("axios");

const API_URL = "";
const API_KEY = "Bearer XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";  //Replace with API key

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
const intentResponses = {
    Admission: "To apply for admission, you'll need a Rank Card,Allotment Cards, transcripts, and an application form.",
    Faculty:"You can find the details of the faculty in your department. Please specify the department.",
    Placements:"The placement cell at GVPCE provides training and placement opportunities to students. For More Details Please do visit:https://www.gvpce.ac.in/campusplace.html",
    Results:"Results are available at https://www.gvpce.ac.in/result.php",
    College_Details:"",
    Events:"Active Events can be viewed at https://www.gvpce.ac.in",
    Achievements:"https://www.gvpce.ac.in/Achievements/INSTITUTIONHGHLIGHTS.pdf",
    Facilities:"GVPCE(A) provides various facilities like Labs, Hostel,Sports, Transport etc etc. For medical related queries visit:https://www.gvpce.ac.in/medfac.html , For Hostel related queries visit:https://www.gvpce.ac.in/hostel.html ,For Transport related queries visit:https://www.gvpce.ac.in/transport.html , For labs visit:https://www.gvpce.ac.in/laboratories.html",
    Syllabus:"The syllabus follows the curriculum of GVPCE(A). For more details:https://gvpce.ac.in/RegulationSyllabi.html",
    Certificates:"For Certiifcate related queries Contact Administrative Office. Administrative Office is at B2",
    Contact_Information:"For any queries regarding College Contact Administrative Office. For more details visit:https://gvpce.ac.in/contactus.html",
    Transfer_Migration:"For Transfer and Migration related queries Contact Department Offices.For CSE Dept: https://gvpce.ac.in/csestaff.html, For ECE:https://gvpce.ac.in/ecestaff.html",
    IIC:"IIC stands for Institution's Innovation Council. It is an initiative by the Ministry of Education (MoE), Government of India, established under the Innovation Cell to promote innovation, entrepreneurship, and startup culture in educational institutions. For more details visit:https://gvpce.ac.in/IIC/about.php",
    Alumni:"Alumni refers to the former students of an institution who have graduated or completed their studies. At GVPCE(A), to connect with ALumni visit:https://gvpce.almaconnect.com/",
    Internships:"GVPCE(A) encourages students to take up internships to gain practical industry experience. Internship opportunities are available through Placement Cell and Departments, For more details visit:https://www.gvpce.ac.in/campusplace.html. GVPCE(A) has tie-up with AICTE which provides virtual Internships for the Students to gain experience various technologies.",
    E_Mobility:"E-Mobility (Electric Mobility) refers to the use of electric vehicles (EVs), including electric cars, bikes, buses, and other battery-powered transportation, as a sustainable alternative to traditional fuel-based vehicles. For more details visit:https://gvpce.ac.in/Emobility.html",
    APPSDC:"APPSDC (Andhra Pradesh State Skill Development Corporation) is an initiative by the Government of Andhra Pradesh to enhance students' employability by providing industry-relevant skill training in various domains like AI-ML,Cloud. For more details visit:https://gvpce.ac.in/siemens.html",
    Anti_Ragging:"GVPCE(A) follows a strict Anti-Ragging policy in accordance with UGC guidelines to ensure a safe and respectful environment for all students. Regarding Anti Ragging Committee members contact:https://gvpce.ac.in/committees/Anti-Ragging%20Committee%202024-2025.pdf",
    IQAC:"IQAC (Internal Quality Assurance Cell) is a committee established at GVPCE(A) to ensure continuous academic and administrative improvement in the institution. For details visit:https://gvpce.ac.in/IQAC/",
    CFII:"CFII (Centre for Innovation, Incubation & Industrial Collaboration) at GVPCE(A) is a dedicated hub that promotes innovation, entrepreneurship, and industry partnerships among students and faculty. It encourages startup culture and provides incubation for innovative projects.",
    Magazine:"The College Magazine at GVPCE(A) is an annual publication that showcases the talents, achievements, and creative works of students and faculty.",
    CFSR:"More details visit:https://gvpce.ac.in/studentactivities/cfsr.php",
    default: "Sorry, I don't understand your query. Can you please rephrase it?",
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// function testModel() {
//     rl.question("Enter your query: ", async (userQuery) => {
//         const response = await queryWit(userQuery);
//         if(userQuery.length==1||0){
//             console.log("No intent detected. Please try again.");
//         }
//         else if (response) {
//             const detectedIntents = response.intents;
//             const detectedIntent = detectedIntents.length > 0 ? detectedIntents[0].name : null;
//             if (detectedIntent) {
//                 const reply = intentResponses[detectedIntent] || intentResponses.default;
//                 console.log("\nBot Response:");
//                 console.log(reply);
//             } else {
//                 console.log("No intent detected. Please try again.");
//             }
//         } else {
//             console.log("Could not fetch a response from Wit.ai.");
//         }

//         testModel(); // Continue the loop for next query
//     });
// }
//testModel();

app.post("/api/chat", async (req, res) => {
    const userQuery = req.body.message;

    const response = await queryWit(userQuery);
    if(userQuery.length==1||userQuery.trim().length==0||!userQuery){
        res.json({ response: "No intent detected. Please try again." });
    }
    else if (response) {
        console.log(response);
        const detectedIntents = response.intents;
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
    } else {
        res.status(500).json({ response: "Could not fetch a response from Wit.ai." });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
