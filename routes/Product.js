const express = require('express');

const productRouter = express.Router();

const {createProduct,getProducts,getProduct,deleteProduct} = require('../controllers/Product');

productRouter.post("/product/createProduct",createProduct);
productRouter.get("/product/getProducts",getProducts);
productRouter.get("/product/getProduct/:productId",getProduct);
productRouter.delete("/product/deleteProduct/:productId",deleteProduct);

module.exports = productRouter;