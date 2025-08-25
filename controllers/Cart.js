const User = require('../models/User');

exports.addToCart = async (req,res) => {
    try {
        const {itemId,size} = req.body;
        const userId = req.user._id;      // As we set the user in req in auth middleware
        const user = await User.findById(userId);
        let cartData = user.cartData;
        if(cartData[itemId]) {
            if(cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        const updatedUser = await User.findByIdAndUpdate(user._id,{cartData},{new: true});

        return res.status(201).json(
            {
                success: true,
                data: updatedUser.cartData,
                message: `Product added to cart`
            }
        );

    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                data: `Error in addToCart`,
                message: error.message
            }
        );
    }
}




exports.updateCart = async (req,res) => {
    try {
        const {itemId,size,quantity} = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        let cartData = user.cartData;
        if(cartData[itemId]) {
            if(cartData[itemId][size]) {
                if(quantity) {
                    cartData[itemId][size] = quantity;
                } else {
                   
                    if(Object.keys(cartData[itemId]).length === 1) {
                        delete cartData[itemId];
                    } else {
                        delete cartData[itemId][size];
                     
                    }
                }
            }
        }
        const updatedUser = await User.findByIdAndUpdate(user._id,{cartData},{new: true});
        return res.status(200).json(
            {
                success: true,
                data: updatedUser.cartData,
                message: `Cart updated`
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                data: `Error in updateCart`,
                message: error.message
            }
        );
    }
}




exports.getCartDataOfAnUser = async (req,res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const cartData = user.cartData;
        return res.status(200).json(
            {
                success: true,
                data: cartData,
                message: `cart fetched`
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                data: `Error in getCartDataOfAnUser`,
                message: error.message
            }
        );
    }
}