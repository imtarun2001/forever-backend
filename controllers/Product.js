



const Product = require('../models/Product');
const cloudinaryUploader = require('../utils/Cloudinary');




// create product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;
        const { image1, image2, image3, image4 } = req.files;
        const images = [image1, image2, image3, image4].filter(image => image !== undefined);
        const arrayOfImagesUrl = await Promise.all(
            images.map(async (image) => {
                const result = await cloudinaryUploader(image, 'forever/products');
                return result.secure_url;
            })
        );

        const product = await Product.create({
            name,
            description,
            price: Number(price),
            images: arrayOfImagesUrl,
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestSeller: bestSeller === 'true' ? true : false,
        });
        return res.status(201).json(
            {
                success: true,
                data: product,
                message: `product created`
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        );
    }
}




// get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(
            {
                success: true,
                data: products,
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        );
    }
}




// get single product
exports.getProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json(
                {
                    success: false,
                    message: `Product not found`
                }
            );
        }
        return res.status(200).json(
            {
                success: true,
                data: product
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        );
    }
}




// delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json(
                {
                    success: false,
                    message: `Product not found`
                }
            );
        }
        return res.status(200).json(
            {
                success: true,
                message: `productId is missing`
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        );
    }
}