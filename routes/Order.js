



const express = require('express');

const orderRouter = express.Router();

const { orderByCod, orderByStripe, getOrdersOfAnUser, getAllOrders, updateOrderStatus, verifyStripe } = require('../controllers/Order');
const { authCustomer, authAdmin } = require('../middlewares/Auth');




orderRouter.post("/order/orderByCod", authCustomer, orderByCod);
orderRouter.post("/order/orderByStripe", authCustomer, orderByStripe);
orderRouter.put("/order/verifyStripe", authCustomer, verifyStripe);
orderRouter.get("/order/getOrdersOfAnUser", authCustomer, getOrdersOfAnUser);

// features for admin only
orderRouter.get("/order/getAllOrders", authAdmin, getAllOrders);
orderRouter.put("/order/updateOrderStatus", authAdmin, updateOrderStatus);

module.exports = orderRouter;