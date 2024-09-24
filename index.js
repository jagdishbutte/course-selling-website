const express = require('express');
const mongoose = require('mongoose');
const { MONGODB_URL } = require("./.env")

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const app = express();

app.use(express.json());
app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

async function main(){
    await mongoose.connect(MONGODB_URL);
    app.listen(3000);
    console.log("Listening on port 3000");
}

main();