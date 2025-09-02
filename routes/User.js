const express = require('express');

const userRouter = express.Router();

const { registerUser, customerLogin, customerLogout, getUsers, getUser, deleteUser, forgotPasswordLinkToEmail, forgotPassword, adminLogin, adminLogout } = require('../controllers/User');
const { authCustomer, authAdmin } = require('../middlewares/Auth');




userRouter.post("/user/registerUser", registerUser);
userRouter.post("/user/customerLogin", customerLogin);
userRouter.post("/user/customerLogout", authCustomer, customerLogout);
userRouter.post("/user/adminLogin", adminLogin);
userRouter.post("/user/adminLogout", authAdmin, adminLogout);
userRouter.get("/user/getUsers", getUsers);
userRouter.get("/user/getUser/:userId", getUser);
userRouter.delete("/user/deleteUser/:userId", deleteUser);
userRouter.post("/user/forgotPasswordLinkToEmail", forgotPasswordLinkToEmail);
userRouter.post("/user/forgotPassword", forgotPassword);

module.exports = userRouter;