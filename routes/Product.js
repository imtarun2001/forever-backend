const express = require('express');

const productRouter = express.Router();

const { createProduct, getProducts, getProduct, deleteProduct } = require('../controllers/Product');

const { authAdmin } = require('../middlewares/Auth');




productRouter.post("/product/createProduct", authAdmin, createProduct);
productRouter.get("/product/getProducts", getProducts);
productRouter.get("/product/getProduct/:productId", getProduct);
productRouter.delete("/product/deleteProduct/:productId", authAdmin, deleteProduct);

module.exports = productRouter;