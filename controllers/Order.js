const Order = require('../models/Order');
const User = require('../models/User');



// order by COD
exports.orderByCod = async (req,res) => {
    try {
        const {firstName,lastName,email,street,zipCode,city,state,country,phone,amount} = req.body;
        const {_id} = req.user;
        const existingUser = await User.findById(_id);
        if(!existingUser) {
            return res.status(401).json(
                {
                    success: false,
                    message: `you are not a registered user`
                }
            );
        }
        const {accountType} = req.user;
        if(accountType !== 'Customer') {
            return res.status(401).json(
                {
                    success: false,
                    message: `you are not permitted`
                }
            );
        }

        await Order.create({user: _id,firstName,lastName,email,street,zipCode,city,state,country,phone,itemsOrdered: existingUser.cartData,paymentStatus: false,amount});

        existingUser.cartData = {};
        await existingUser.save();
        res.status(201).json(
            {
                success: true,
                message: `order placed`
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: error.message
            }
        )
    }
}




// oder by stripe
exports.orderByStripe = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}




// order by razorpay
exports.orderByRazorpay = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}