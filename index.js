// This program initializes a MongoDB connection using Mongoose
// Creates an Express server listening on port 3000.

const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/UMS');

const express = require('express');
const app = express();

const userRoute = require("./routes/userRoute");
app.use('/', userRoute)

const port = 3000;

app.listen(port, function () {
    console.log(`App listening on port ${port}!`)
});