// Imports the User model for interacting with user data.
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash
    } catch (error) {
        console.log();
    }
}

// Defines a function to render the registration page.
const loadRegister = async (req, res) => {
    try {
        res.render('registration') // Render the registration page
    } catch (error) {
        console.log(error.message); // Log any errors that occur
    }
}

const insertUser = async (req, res) => {
    try {
        const sPassword = await securePassword(req.body.password)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file.filename,
            // password: req.body.password,
            password: sPassword,
            is_admin: 0
        })

        const userData = await user.save();

        if (userData) {
            res.render('registration', { message: 'Registration Successful' })
        } else {
            res.render('registration', { message: 'Registration Failed' })

        }

    } catch (error) {
        console.log(error.message);
    }
}

// Exports the function to allow it to be used by other parts of the application.
module.exports = {
    loadRegister,
    insertUser
}
