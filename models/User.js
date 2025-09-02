



const mongoose = require('mongoose');




const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, trim: true },
        otps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Otp" }],
        accountType: { type: String, required: true, enum: ["Customer", "Admin"] },
        cartData: { type: Object, default: {} }
    },
    { minimize: false, timestamps: true }
);




module.exports = mongoose.model("User", userSchema);