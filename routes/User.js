const express = require('express');

const userRouter = express.Router();

const {registerUser,loginUser,getUsers,getUser,deleteUser,logoutUser} = require('../controllers/User');
const {auth,isAdmin} = require('../middlewares/Auth');

userRouter.post("/user/registerUser",registerUser);
userRouter.post("/user/loginUser",loginUser);
userRouter.get("/user/getUsers",getUsers);
userRouter.get("/user/getUser/:userId",getUser);
userRouter.delete("/user/deleteUser/:userId",deleteUser);
userRouter.post("/user/logoutUser",logoutUser);

userRouter.get("/user/isAdmin",auth,isAdmin,(req,res) => {
    return res.status(200).json(
        {
            success: true,
            data: req.user.accountType,
            message: `Welcome to Admin route`
        }
    );
});

module.exports = userRouter;