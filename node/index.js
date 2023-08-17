
//import the exprss module
const express = require('express');
//import the node-persist module
const Storage = require('node-persist');
//create a new instance
const app = express();
Storage.init(); // initializing the storage

app.use(express.json()); // body parser
//define the route for http post request
app.post("/student", (req, res) => {
    const { id, name, gpa } = req.body;
    Storage.setItem(id, { id, name, gpa });
    res.status(201).json({ message: "Data inserted successfully" });
});
//define the route for handling http get request
app.get("/student/:id", async (req, res) => {
    const id = req.params.id;
    const student = await Storage.getItem(id);
  //set the condition
    if (!student) {
        // If student with the provided ID doesn't exist, send a 404 response
        let html = '';
        html += `<h2>Student not found</h2>`;
        return res.status(404).send(html);
    }
  
    let html = `<h1> Student detail </h1>`;
    html += `
      <h2>Id: ${student.id}</h2>
      <h2>Name: ${student.name}</h2>
      <h2>Gpa: ${student.gpa}</h2>
    `;
  
    res.send(html);
  });
  

//define the route for handling http get request for all students
app.get("/allstudents", async (req, res) => {
    const all = await Storage.values();
    let html = `<h1> All students data </h1>`;
    const allstudents = await Storage.values(); // fetch all stored student objects
    //sort the array based on the student id in ascending order
    allstudents.sort((a,b)=>{return a.id-b.id})



    allstudents.forEach((student) => {
        html += `
        <h2>Id: ${student.id}</h2>
        <h2>Name: ${student.name}</h2>
        <h2>Gpa: ${student.gpa}</h2>
        <hr />
        `;
    });
    res.send(html);
});
//define the route for handling http get request for topper student
app.get("/topper", async (req, res) => {
    const allstudents = await Storage.values(); // Fetch all stored student objects
    let html = `<h1> Topper Student detail</h1>`;

    // Find the highest GPA among all students
    let highestGPA = 0;
    allstudents.forEach((student) => {
        if (student.gpa > highestGPA) {
            highestGPA = student.gpa;
        }
    });

    // Filter and display only the students with the highest GPA
    allstudents.forEach((student) => {
        if (student.gpa === highestGPA) {
            html += `
                <h2>Id: ${student.id}</h2>
                <h2>Name: ${student.name}</h2>
                <h2>Gpa: ${student.gpa}</h2>
                <hr />
            `;
        }
    });

    res.send(html);
});


// starting the server at localhost:5000
app.listen(5000, () => {
    console.log("Server started");
});
