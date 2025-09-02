



const mongoose = require('mongoose');
const mail = require('../utils/Mail');
const orderPlacedTemplate = require('../templates/OrderPlaced');
const User = require('./User');
const giftedToTemplate = require('../templates/GiftedTo');




const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        street: { type: String, required: true },
        zipCode: { type: Number, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: Number, required: true },
        itemsOrdered: { type: Array, required: true },
        orderStatus: { type: String, required: true, default: 'Order Placed' },
        paymentMethod: { type: String, required: true },
        paymentStatus: { type: Boolean, required: true, default: false },
        amount: { type: Number, required: true }
    },
    { timestamps: true }
);




orderSchema.post("save", async (doc) => {
    try {
        const createdDate = doc.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
        const user = await User.findById(doc.user);
        if (doc.email === user.email) {
            return await mail(doc.email, 'Order Placed', orderPlacedTemplate(doc.firstName, doc.email, doc._id, createdDate, doc.amount));
        } else {
            const user = await User.findById(doc.user);
            await mail(user.email, 'Order Placed', orderPlacedTemplate(doc.firstName, user.email, doc._id, createdDate, doc.amount));
            await mail(doc.email, 'Greetings from Forever🤍🛍️', giftedToTemplate(doc.firstName, user.name, doc.email, doc._id, createdDate));
        }
    } catch (error) {
        console.log(error.message);
    }
});




module.exports = mongoose.model("Order", orderSchema);