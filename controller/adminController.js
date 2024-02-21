
const User = require("../models/userModel")
const bcrypt = require('bcrypt')

const loadLogin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        // console.log(email, password);
        const userData = await User.findOne({ email: email })
        // console.log(userData);
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            // console.log(passwordMatch);
            if (passwordMatch) {
                if (userData.is_admin === 1) {
                    req.session.user_id = userData._id;
                    res.redirect("/admin/home");

                } else {

                    res.render('login', { message: "Invalid Credentials" })

                }
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

const loadDashboard = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id })
        res.render('home', { admin: userData });
    } catch (error) {
        console.log(error.message)
    }
}

const logout = async (req, res) => {
    try {

        req.session.destroy();
        res.redirect('/admin')

    } catch (error) {
        console.log(error.message)
    }
}


module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout
}
