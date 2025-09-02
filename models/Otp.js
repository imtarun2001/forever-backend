



const mongoose = require('mongoose');
const mail = require('../utils/Mail');
const registrationOtpTemplate = require('../templates/RegistrationOtp');




const otpSchema = new mongoose.Schema(
    {
        otp: { type: String, required: true },
        email: { type: String, required: true },
        createdAt: { type: Date, required: true, default: Date.now, expires: 5 * 60 },
    }
);




otpSchema.pre("save", async function (next) {
    try {
        await mail(this.email, 'OTP for registration', registrationOtpTemplate(this.otp));
        next();
    } catch (error) {
        next(error);
    }
});




module.exports = mongoose.model("Otp", otpSchema);