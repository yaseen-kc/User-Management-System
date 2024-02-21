// Import necessary modules and packages
const mongoose = require("mongoose"); // Import Mongoose for MongoDB interaction
mongoose.connect('mongodb://127.0.0.1:27017/UMS'); // Connect to MongoDB
const express = require('express'); // Import Express framework
const app = express(); // Create an Express application

const session = require('express-session');
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Import userRoute for handling user-related routes
const userRoute = require("./routes/userRoute");
app.use('/', userRoute); // Use userRoute for all routes

const port = 3000; // Define port number for the server to listen on

// Start the server and listen on the defined port
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});