const mongoose = require("mongoose");
const bodyParser = require("body-parser")
mongoose.connect("mongodb://localhost:27017/user_management_system");
const path = require("path")
const express = require("express")
const flash = require("express-flash")

const nocache = require("nocache")

const app = express();
app.use(nocache())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/static", express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))

app.use(express.static('views'))


app.use(flash());

// for user routes
const userRoute = require("./routers/userRoute")
app.use("/", userRoute)

// for admin routes 
const adminRoute = require("./routers/adminRoute")
app.use("/admin", adminRoute)



app.listen(3000, () => {
    console.log("http://localhost:3000/")
})  