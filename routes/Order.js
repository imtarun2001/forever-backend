const express = require('express');

const orderRouter = express.Router();

const {orderByCod, orderByStripe, orderByRazorpay} = require('../controllers/Order');
const {auth} = require('../middlewares/Auth');

orderRouter.post("/order/orderByCod",auth,orderByCod);
orderRouter.post("/order/orderByStripe",auth,orderByStripe);
orderRouter.post("/order/orderByRazorpay",auth,orderByRazorpay);

module.exports = orderRouter;