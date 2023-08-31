const express = require('express');
const mongoose = require('mongoose');
const model = require('./model');
const app = express();
const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;

mongoose.connect("mongodb+srv://naufalk:mongodbadmin@cluster0.06hcc.mongodb.net/priplan?retryWrites=true&w=majority")

let planDocument = {
    title: "sepuhhhhhhh",
    plan: "akumah masih pemula", 
    "start_date": "",
    "end_date": "",
    is_completed: true
}


app.get('/', async (req, res) => {
    
    await model.insertMany([planDocument])
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server running at ${baseUrl}`);
});


// model.insertMany([planDocument])