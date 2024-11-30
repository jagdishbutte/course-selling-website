const { Router } = require("express");
const courseRouter = Router();
const { courseModel, purchaseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");

// Endpoint to Purchase a Course
courseRouter.post("/purchase", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.body;

    // Validate that the course exists
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the user has already purchased the course
    const existingPurchase = await purchaseModel.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({ message: "Course already purchased" });
    }

    // Record the purchase
    await purchaseModel.create({ userId, courseId });

    res.json({ message: "You have successfully bought the course" });
  } catch (error) {
    console.error("Error during course purchase:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to Preview All Courses
courseRouter.get("/preview", async (req, res) => {
  try {
    const courses = await courseModel.find({});
    res.json({ courses });
  } catch (error) {
    console.error("Error during course preview:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  courseRouter,
};
