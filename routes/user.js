const { Router } = require('express');
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require('../config');
const { userMiddleware } = require("../middleware/user");

const userRouter = Router();

userRouter.post("/signup", async (req, res)=>{
    const { email, password, firstName, lastName} = req.body;

    await userModel.create({
        email: email,
        password: password,
        firstName: firstName, 
        lastName: lastName
    })

    res.json({
        message: "You are signed up successfully as a user"
    });
});

userRouter.post("/signin", async (req, res)=>{

    const { email, password } = req.body;

    const user = userModel.findOne({
        email: email,
        password: password
    });

    if(user){
        const token = jwt.sign({
            id: user._id
        }, JWT_USER_PASSWORD);

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

userRouter.get("/purchases", userMiddleware, async (req, res)=>{
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId
    });

    let purchasedCoursesIds = [];

    for(let i = 0; i<purchases.length; i++){
        purchasedCoursesIds.push(purchases[i].courseId);
    }

    const courseData = await courseModel.find({
        _id: {$in: purchasedCoursesIds}
    });

    res.json({
        purchases,
        courseData
    });
});

module.exports = {
    userRouter: userRouter
}