const express = require('express');

const userRouter = express.Router();

const { registerUser, loginUser, getUsers, getUser, deleteUser, logoutUser, forgotPasswordLinkToEmail, forgotPassword, adminLogin } = require('../controllers/User');
const { auth } = require('../middlewares/Auth');

userRouter.post("/user/registerUser", registerUser);
userRouter.post("/user/loginUser", loginUser);
userRouter.get("/user/getUsers", getUsers);
userRouter.get("/user/getUser/:userId", getUser);
userRouter.delete("/user/deleteUser/:userId", deleteUser);
userRouter.post("/user/logoutUser", auth, logoutUser);
userRouter.post("/user/forgotPasswordLinkToEmail", forgotPasswordLinkToEmail);
userRouter.post("/user/forgotPassword", forgotPassword);
userRouter.post("/user/adminLogin", adminLogin);

module.exports = userRouter;