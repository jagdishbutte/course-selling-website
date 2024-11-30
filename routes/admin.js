const { Router } = require("express");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const adminRouter = Router();

// Admin Signup
adminRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create admin
    await adminModel.create({
      email,
      password: hashPassword,
      firstName,
      lastName,
    });

    res.json({
      message: "You are signed up successfully as an admin",
    });
  } catch (error) {
    console.error("Error during admin signup:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin Signin
adminRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);

    res.json({ token });
  } catch (error) {
    console.error("Error during admin signin:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a New Course
adminRouter.post("/course", adminMiddleware, async (req, res) => {
  try {
    const adminId = req.userId;
    const { title, description, price, imageUrl } = req.body;

    const course = await courseModel.create({
      title,
      description,
      imageUrl,
      price,
      creatorId: adminId,
    });

    res.json({
      message: "New course created",
      courseId: course._id,
    });
  } catch (error) {
    console.error("Error during course creation:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update an Existing Course
adminRouter.put("/course", adminMiddleware, async (req, res) => {
  try {
    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.findOneAndUpdate(
      { _id: courseId, creatorId: adminId },
      { title, description, imageUrl, price },
      { new: true }
    );

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or not authorised" });
    }

    res.json({
      message: "Course updated successfully",
      courseId: course._id,
    });
  } catch (error) {
    console.error("Error during course update:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get All Courses Created by Admin
adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
  try {
    const adminId = req.userId;

    const courses = await courseModel.find({ creatorId: adminId });

    res.json({
      message: "All courses retrieved successfully",
      courses,
    });
  } catch (error) {
    console.error("Error during fetching courses:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  adminRouter,
};
