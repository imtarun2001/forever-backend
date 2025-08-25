const express = require('express');

const productRouter = express.Router();

const {createProduct,getProducts,getProduct,deleteProduct} = require('../controllers/Product');

productRouter.post("/createProduct",createProduct);
productRouter.get("/getProducts",getProducts);
productRouter.get("/getProduct/:productId",getProduct);
productRouter.delete("/deleteProduct/:productId",deleteProduct);

module.exports = productRouter;