const express = require('express');

const cartRouter = express.Router();

const {addToCart,updateCart,getCartDataOfAnUser} = require('../controllers/Cart');

const {auth} = require('../middlewares/Auth');

cartRouter.post("/cart/addToCart",auth,addToCart);
cartRouter.put("/cart/updateCart",auth,updateCart);
cartRouter.get("/cart/getCartDataOfAnUser",auth,getCartDataOfAnUser);

module.exports = cartRouter;