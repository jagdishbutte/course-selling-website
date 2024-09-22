const { Router } = require("express");
const adminRouter = Router();

adminRouter.post("/signup", (req, res)=>{
    res.json({
        message: "Your Courses"
    });
});

adminRouter.post("/signin", (req, res)=>{
    res.json({
        message: "All Courses"
    });
});

adminRouter.post("/course", (req, res)=>{
    res.json({
        message: "Create new Course"
    });
});

adminRouter.put("/course", (req, res)=>{
    res.json({
        message: "Update Course"
    });
});

adminRouter.get("/course", (req, res)=>{
    res.json({
        message: "All Courses"
    });
});

module.exports = {
    adminRouter: adminRouter
}