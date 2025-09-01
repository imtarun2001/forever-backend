const Otp = require('../models/Otp');
const otpGenerator = require('otp-generator');
const User = require('../models/User');

exports.generateOtp = async (req,res) => {
    try {
        const {email} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(401).json(
                {
                    success: false,
                    message: `already registered email`
                }
            );
        }
        let otp = otpGenerator.generate(6,{
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        let result = await Otp.findOne({otp});
        while(result) {
            otp = otpGenerator.generate(6,{
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
            result = await Otp.findOne({otp});
        }
        await Otp.create({email,otp});
        return res.status(201).json(
            {
                success: true,
                message: `otp sent to email`
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