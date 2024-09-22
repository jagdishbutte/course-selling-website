const { Router } = require('express');
const userRouter = Router();

userRouter.post("/signup", (req, res)=>{
    res.json({
        message: "User signup endpoint"
    });
});

userRouter.post("/signin", (req, res)=>{
    res.json({
        message: "User Signin endpoint"
    });
});

userRouter.get("/purchases", (req, res)=>{
    res.json({
        message: "user purchase course"
    });
});

module.exports = {
    userRouter: userRouter
}