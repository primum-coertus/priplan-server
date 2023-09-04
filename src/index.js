const express = require('express');
const mongoose = require('mongoose');
const route = require('./route');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/priplan');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(route);

app.listen(port, () => {
  console.log(`Server running at ${baseUrl}`);
});
