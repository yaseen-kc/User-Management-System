const User = require("../models/userModel");
const bcrypt = require("bcrypt");



const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const loadRegister = async (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error.message);
  }
};

const insertUser = async (req, res) => {
  try {
    // Trim whitespace from the name field
    const trimmedName = req.body.name.trim();

    // Check if the trimmed name is empty or contains non-alphabetic characters
    if (!trimmedName || !/^[a-zA-Z]+$/.test(trimmedName)) {
      return res.render("registration", { message: "Invalid name format." });
    }

    // Check if the password meets the minimum length requirement
    const minPasswordLength = 8;
    if (req.body.password.length < minPasswordLength) {
      return res.render("registration", {
        message: `Password must be at least ${minPasswordLength} characters long.`,
      });
    }

    const spassword = await securePassword(req.body.password);

    const user = new User({
      name: trimmedName,
      email: req.body.email,
      mobile: req.body.mno,
      password: spassword,
      is_admin: 0,
    });

    const userData = await user.save();

    if (userData) {
      res.render("registration", {
        message: "Your registration is successful. Please verify your email.",
      });
    } else {
      res.render("registration", { message: "Your registration failed." });
    }
  } catch (error) {
    console.log(error.message);
    res.render("registration", { message: "An error occurred during registration." });
  }
};


// login user

const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });




    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (passwordMatch) {
        req.session.user_id = userData._id;
        res.redirect("/home");
      } else {

        res.render("login", { message: "Email and password incorrect" });
      }
    } else {

      res.render("login", { message: "Email and password incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {

    const userData = await User.findById({ _id: req.session.user_id });
    res.render("home", { user: userData });

  } catch (error) {
    console.log(error.message);
  }
};

const userLogout = async (req, res) => {
  try {

    req.session.destroy();
    res.redirect("/");

  } catch (error) {
    console.log(error.message)
  }
}

/// user profile edit and update

const editLoad = async (req, res) => {

  try {

    const id = req.query.id;

    const userData = await User.findById(id)

    if (userData) {

      res.render('edit', { user: userData });
    } else {
      res.redirect('/home');
    }

  } catch (error) {
    console.log(error.message)
  }
}

const updateProfile = async (req, res) => {

  try {

    const userData = await User.findByIdAndUpdate({ _id: req.body.user_id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mno
        }
      });


    res.redirect('/home')
  } catch (error) {
    console.log(error.message)
  }
}

const review = async (req, res) => {

}

module.exports = {
  loadRegister,
  insertUser,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
  editLoad,
  updateProfile
};
