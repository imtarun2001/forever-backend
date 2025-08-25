const mongoose = require('mongoose');
const mail = require('../utils/Mail');

const otpSchema = new mongoose.Schema(
    {
        otp: { type: String, required: true },
        email: { type: String, required: true },
        createdAt: { type: Date, required: true, default: Date.now, expires: 5 * 60 },
    }
);

otpSchema.pre("save",async function(next) {
    try {
        await mail(this.email,'OTP for registration',this.otp);
        next();
    } catch (error) {
        console.log(`Error in otpSchema.pre save middleware`);
        console.log(error);
        next(error);
    }
});

module.exports = mongoose.model("Otp",otpSchema);