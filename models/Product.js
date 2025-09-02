



const mongoose = require('mongoose');




const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        images: { type: Array, required: true },
        category: { type: String, required: true },
        subCategory: { type: String, required: true },
        sizes: { type: Array, required: true },
        bestSeller: { type: Boolean }
    },
    { timestamps: true }
);




module.exports = mongoose.model("Product", productSchema);