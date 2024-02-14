// Import necessary modules and packages
const express = require('express'); // Import Express framework
const user_route = express(); // Create a new Express router

// Set view engine and views directory for rendering EJS templates
user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');

const bodyParser = require('body-parser'); // Import body-parser for parsing request bodies
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

const multer = require('multer'); // Import multer for handling file uploads
const path = require('path');

// Define storage settings for uploaded images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/userImages')); // Set destination directory for uploaded images
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname; // Set filename with timestamp
        cb(null, name); // Set filename for uploaded image
    }
});

const upload = multer({ storage: storage }); // Create multer instance with defined storage settings

const userController = require('../controller/userController'); // Import userController for handling user-related logic

// Define routes for user registration
user_route.get('/register', userController.loadRegister); // GET route to render registration form
user_route.post('/register', upload.single('image'), userController.insertUser); // POST route to handle user registration

module.exports = user_route; // Export user_route for use in main application
