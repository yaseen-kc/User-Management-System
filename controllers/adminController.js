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

const loadLogin = async (req, res) => {
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
        if (userData.is_admin === 0) {
          res.render("login", { message: "Email and password incorrect.." });
        } else {
          req.session.user_id = userData._id;
          res.redirect("/admin/home");
        }
      } else {
        res.render("login", { message: "Email and password incorrect.." });
      }
    } else {
      res.render("login", { message: "Email and password incorrect.." });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadDashboard = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });

    res.render("home", { admin: userData });
  } catch (error) {
    console.log(error.message);
  }
};
const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};

const adminDashboard = async (req, res) => {
  try {
    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    const usersData = await User.find({
      is_admin: 0,
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
        { mobile: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    });
    res.render("dashboard", { users: usersData });
  } catch (error) {
    console.log(error.message);
  }
};

// add new user

const newUserLoad = async (req, res) => {
  try {
    console.log("Hello World");
    res.render("new-user");
  } catch (error) {
    console.log(error.message);
  }
};

const addUser = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mno;

    // Trim whitespace from the name field
    const trimmedName = name.trim();

    // Check if the trimmed name is empty or contains non-alphabetic characters
    if (!trimmedName || !/^[a-zA-Z]+$/.test(trimmedName)) {
      return res.render("new-user", { message: "Invalid name format." });
    }

    // Check if the password meets the minimum length requirement
    const minPasswordLength = 8;
    const password = req.body.password;
    if (!password || password.length < minPasswordLength) {
      return res.render("new-user", {
        message: `Password must be at least ${minPasswordLength} characters long.`,
      });
    }

    const spassword = await securePassword(password);

    const user = new User({
      name: trimmedName,
      email: email,
      mobile: mobile,
      password: spassword,
      is_admin: 0,
    });

    const userData = await user.save();

    if (userData) {
      res.redirect("/admin/dashboard");
    } else {
      res.render("new-user", { message: "Something went wrong" });
    }
  } catch (error) {
    console.log(error.message);
    res.render("new-user", {
      message: "An error occurred during registration.",
    });
  }
};

const editUserLoad = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findById({ _id: id });
    if (userData) {
      res.render("edit-user", { user: userData });
    } else {
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//update users

const updateUsers = async (req, res) => {
  try {
    const userData = await User.findByIdAndUpdate(
      { _id: req.body.user_id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mno,
        },
      }
    );
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// delete users

const deleteUser = async (req, res) => {
  try {
    const id = req.query.id;

    await User.deleteOne({ _id: id });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadLogin,
  verifyLogin,
  loadDashboard,
  logout,
  adminDashboard,
  newUserLoad,
  addUser,
  editUserLoad,
  updateUsers,
  deleteUser,
};
