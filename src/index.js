const express = require('express');
const mongoose = require('mongoose');
const model = require('./model');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/priplan');

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/', async (req, res) => {
  const getTitle = req.body.title
  const getPlan = req.body.plan
  const getStart_date = req.body.start_date
  const getEnd_date = req.body.end_date
  const getIs_completed = req.body.is_completed

  const planDocument = {
    title:getTitle,
    plan:getPlan,
    "start_date":getStart_date,
    "end_date":getEnd_date,
    is_completed:getIs_completed
  }

  await model.insertMany([planDocument])
  res.send("berhasil menambahkan rencana")
})

app.listen(port, () => {
    console.log(`Server running at ${baseUrl}`);
});
