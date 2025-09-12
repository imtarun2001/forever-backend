



const Order = require('../models/Order');
const User = require('../models/User');
const Stripe = require('stripe');
require('dotenv').config();
const currency = 'inr';
const deliveryFee = 10;




// order by COD
exports.orderByCod = async (req, res) => {
    try {
        const { firstName, lastName, email, street, zipCode, city, state, country, phone, paymentMethod, amount, itemsOrdered } = req.body;
        if (paymentMethod !== 'cod') {
            return res.status(400).json(
                {
                    success: false,
                    message: `only applicable for cod`
                }
            );
        }
        const userId = req.user._id;
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(401).json(
                {
                    success: false,
                    message: `you are not registered`
                }
            );
        }

        await Order.create({ user: existingUser._id, firstName, lastName, email, street, zipCode, city, state, country, phone, itemsOrdered, paymentMethod, paymentStatus: false, amount });

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
exports.orderByStripe = async (req, res) => {
    try {
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const { origin } = req.headers;

        const { firstName, lastName, email, street, zipCode, city, state, country, phone, paymentMethod, amount, itemsOrdered } = req.body;

        if (paymentMethod !== 'stripe') {
            return res.status(400).json(
                {
                    success: false,
                    message: `only customers can order`
                }
            );
        }

        const { _id } = req.user;
        const existingUser = await User.findById(_id);
        if (!existingUser) {
            return res.status(401).json(
                {
                    success: false,
                    message: `you are not registered`
                }
            );
        }

        const order = await Order.create({ user: _id, firstName, lastName, email, street, zipCode, city, state, country, phone, itemsOrdered, paymentMethod, paymentStatus: false, amount });


        const line_items = itemsOrdered.map((item) => (
            {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price * 100
                },
                quantity: item.quantity
            }
        ));

        line_items.push(
            {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: 'Delivery Fee'
                    },
                    unit_amount: deliveryFee * 100
                },
                quantity: 1
            }
        );

        const session = await stripeInstance.checkout.sessions.create(
            {
                success_url: `${origin}/verify?success=true&orderId=${order._id}`,
                cancel_url: `${origin}/verify?success=false&orderId=${order._id}`,
                line_items,
                mode: 'payment'
            }
        );

        return res.status(200).json(
            {
                success: true,
                data: session.url
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




// verify stripe payment
exports.verifyStripe = async (req, res) => {
    try {
        const { orderId, success } = req.body;
        const userId = req.user._id;
        if (success === 'true') {
            await Order.findByIdAndUpdate(orderId, { paymentStatus: true }, { new: true });
            await User.findByIdAndUpdate(userId, { cartData: {} });
            return res.status(200).json(
                {
                    success: true,
                    message: `payment success`
                }
            );
        } else {
            await Order.findByIdAndDelete(orderId);
            return res.status(400).json(
                {
                    success: false,
                    message: `payment failed`
                }
            );
        }
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        );
    }
}




// get orders of an user
exports.getOrdersOfAnUser = async (req, res) => {
    try {
        const { _id } = req.user;
        const orders = await Order.find({ user: _id });

        return res.status(200).json(
            {
                success: true,
                data: orders,
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




// get all orders for admin
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        if (orders.length === 0) {
            return res.status(404).json(
                {
                    success: false,
                    message: `no orders found`
                }
            );
        }
        return res.status(200).json(
            {
                success: true,
                data: orders
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




// update order status of the order
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body;

        await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true });

        return res.status(200).json(
            {
                success: true,
                message: `status updated`
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                data: error.message
            }
        );
    }
}