const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, trim: true },
        otps: [ { type: mongoose.Schema.Types.ObjectId, ref: "Otp" } ],
        accountType: { type: String, required: true, enum: ["Customer","Admin"]},
        cartData: { type: Object, default: {} },
        orders: [ { type: mongoose.Schema.Types.ObjectId, ref: "Order" } ]
    },
    { minimize: false, timestamps: true }     //whenever we create an empty object, mongodb will neglect it. To prevent this add {minimize: false}
);

module.exports = mongoose.model("User",userSchema);