const User = require('../models/User');

exports.addToCart = async (req,res) => {
    try {
        const {itemId,size} = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(
                {
                    success: false,
                    message: "User not found",
                }
            );
        }
        let cartData = await user.cartData;
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
        await User.findByIdAndUpdate(user._id,{cartData});

        return res.status(201).json(
            {
                success: true,
                message: `added to cart`
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




exports.updateCart = async (req,res) => {
    try {
        const {itemId,size,quantity} = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(
                {
                    success: false,
                    message: "User not found",
                }
            );
        }
        let cartData = await user.cartData;
        if(quantity === 0) {
            if(Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            } else {
                delete cartData[itemId][size];
            }
        } else {
            cartData[itemId][size] = quantity;
        }
        const updatedUser = await User.findByIdAndUpdate(user._id,{cartData},{new: true});
        return res.status(200).json(
            {
                success: true,
                message: `${Object.keys(updatedUser.cartData).length === 0 ? `no items left` : `cart updated`}`
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




exports.getCartDataOfAnUser = async (req,res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(
                {
                    success: false,
                    message: "User not found",
                }
            );
        }
        return res.status(200).json(
            {
                success: true,
                data: user.cartData,
                message: `your cart`
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