const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");
const bcrypt = require("bcrypt");

const userRouter = Router();

//User Signup
userRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await userModel.findOne({ email }); 
    if (existingUser) {
      return res.status(400).json({
        message: "User  already exists",
      });
    }
    // Hashing password to store in db
    const hashPassword = await bcrypt.hash(password, 10);

    //Creating user
    await userModel.create({
      email,
      password: hashPassword,
      firstName,
      lastName,
    });

    res.json({
      message: "You are signed up successfully as a user",
    });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//User Login
userRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Finding if user already exists by email
    const user = await userModel.findOne({ email }); 
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Comparing the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generating token
    const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

//Seeing users purchases
userRouter.get("/purchases", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const purchases = await purchaseModel.find({ userId });

    let purchasedCoursesIds = purchases.map((purchase) => purchase.courseId); 

    const courseData = await courseModel.find({
      _id: { $in: purchasedCoursesIds },
    });

    res.json({
      purchases,
      courseData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching purchases" });
  }
});

module.exports = {
  userRouter: userRouter,
};
