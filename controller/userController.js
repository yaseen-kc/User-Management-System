// Imports the User model for interacting with user data.
const User = require('../models/userModel')

// Defines a function to render the registration page.
const loadRegister = async (req, res) => {
    try {
        res.render('registration') // Render the registration page
    } catch (error) {
        console.log(error.message); // Log any errors that occur
    }
}

// Exports the function to allow it to be used by other parts of the application.
module.exports = {
    loadRegister
}
