const express = require('express');

const orderRouter = express.Router();

const {orderByCod, orderByStripe, orderByRazorpay, getOrdersOfAnUser, getAllOrders, updateOrderStatus, verifyStripe} = require('../controllers/Order');
const {auth, isAdmin} = require('../middlewares/Auth');

orderRouter.post("/order/orderByCod",auth,orderByCod);
orderRouter.post("/order/orderByStripe",auth,orderByStripe);
orderRouter.put("/order/verifyStripe",auth,verifyStripe);
orderRouter.post("/order/orderByRazorpay",auth,orderByRazorpay);
orderRouter.get("/order/getOrdersOfAnUser",auth,getOrdersOfAnUser);

// features for admin only
orderRouter.get("/order/getAllOrders",auth,isAdmin,getAllOrders);
orderRouter.put("/order/updateOrderStatus",auth,isAdmin,updateOrderStatus);

module.exports = orderRouter;