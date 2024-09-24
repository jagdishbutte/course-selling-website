const { Router } = require("express");
const courseRouter = Router();
const { courseModel } = require("../db");

courseRouter.post("/purchase", (req, res)=>{
    res.json({
        message: "Your Courses"
    });
});

courseRouter.get("/preview", (req, res)=>{
    res.json({
        message: "All Courses"
    });
});

module.exports = {
    courseRouter: courseRouter
}