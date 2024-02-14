// Import necessary modules and packages
const mongoose = require("mongoose"); // Import Mongoose for MongoDB interaction

// Define a Mongoose schema for user data
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: Number,
        required: true
    },
    is_verified: {
        type: Number,
        default: 0
    }
});

// Export the Mongoose model for the User schema
module.exports = mongoose.model('User', userSchema);
