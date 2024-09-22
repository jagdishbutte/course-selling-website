const express = require('express');
const mongoose = require('mongoose');

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const app = express();

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);
app.use(express.json());

async function main(){
    await mongoose.connect("mongodb+srv://james:james123@cluster0.hqs2m.mongodb.net/coursera");
    app.listen(3000);
    console.log("Listening on port 3000");
}

main();