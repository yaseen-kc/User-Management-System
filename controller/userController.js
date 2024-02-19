// Import necessary modules and packages
const User = require('../models/userModel'); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Function to hash the password using bcrypt
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10); // Hash the password with a salt of 10 rounds
        return passwordHash; // Return the hashed password
    } catch (error) {
        console.log(error.message); // Log any errors that occur during hashing
    }
}

// Function to render the registration page
const loadRegister = async (req, res) => {
    try {
        res.render('registration'); // Render the registration page
    } catch (error) {
        console.log(error.message); // Log any errors that occur
    }
}

// Function to insert a new user into the database
const insertUser = async (req, res) => {
    try {
        const sPassword = await securePassword(req.body.password); // Hash the user's password
        const user = new User({ // Create a new User object with user data
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file.filename,
            password: sPassword, // Store the hashed password
            is_admin: 0 // Set admin status
        });

        const userData = await user.save(); // Save the user data to the database

        // Render registration page with success or failure message
        if (userData) {
            res.render('registration', { message: 'Registration Successful' });
        } else {
            res.render('registration', { message: 'Registration Failed' });
        }

    } catch (error) {
        console.log(error.message); // Log any errors that occur
    }
}

const loginLoad = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password

        const userData = await User.findOne({ email: email })
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                req.session.user_id = userData._id;
                res.redirect('/home');
            } else {
                res.render('login', { message: "Invalid Credentials" })
            }
        } else {
            res.render('login', { message: "Invalid Credentials" })
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadHome = async (req, res) => {
    try {
        res.render('home')
    } catch (error) {
        console.log(error.message);
    }
}
// Export functions to be used by other parts of the application
module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome
}
