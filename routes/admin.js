const { Router } = require("express");
const { JWT_ADMIN_PASSWORD } = require('../config');
const { adminMiddleware } = require("../middleware/admin");
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");

const adminRouter = Router();

adminRouter.post("/signup", async (req, res)=>{
    const { email, password, firstName, lastName} = req.body;

    await adminModel.create({
        email: email,
        password: password,
        firstName: firstName, 
        lastName: lastName
    })

    res.json({
        message: "You are signed up successfully as an admin"
    });
});

adminRouter.post("/signin", async (req, res)=>{
    const { email, password } = req.body;

    const user = adminModel.findOne({
        email: email,
        password: password
    });

    if(user){
        const token = jwt.sign({
            id: user._id
        }, JWT_ADMIN_PASSWORD);

        res.json({
            token
        });
    }
    else{
        res.status(403).json({
            message: "Incorrect Credentials"
        });
    }   
});

adminRouter.post("/course", adminMiddleware, async (req, res)=>{
    const adminId = req.userId;

    const { title, description, price, imageUrl } = req.body;

    const course = await courseModel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    });

    res.json({
        message: "New course created",
        courseId: course._id
    });
});

adminRouter.put("/course", adminMiddleware, async (req, res)=>{
    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    },{
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price
    });
    
    res.json({
        message: "Course Updated",
        courseId: course._id
    });
});

adminRouter.get("/course/bulk", adminMiddleware, async (req, res)=>{
    const adminId = req.userId;
    
    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message: "All Courses",
        courses
    });
});

module.exports = {
    adminRouter: adminRouter
}