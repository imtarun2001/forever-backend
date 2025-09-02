



const express = require('express');

const cartRouter = express.Router();

const { addToCart, updateCart, getCartDataOfAnUser } = require('../controllers/Cart');
const { authCustomer } = require('../middlewares/Auth');




cartRouter.post("/cart/addToCart", authCustomer, addToCart);
cartRouter.put("/cart/updateCart", authCustomer, updateCart);
cartRouter.get("/cart/getCartDataOfAnUser", authCustomer, getCartDataOfAnUser);




module.exports = cartRouter;