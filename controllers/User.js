const User = require('../models/User');
const Otp = require('../models/Otp');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mail = require('../utils/Mail');
require('dotenv').config();

exports.registerUser = async (req,res) => {
    try {
        const {name,email,password,otp} = req.body;
        
        if(!validator.isEmail(email)) {
            return res.status(400).json(
                {
                    success: false,
                    message: `Please provide a valid email`
                }
            );
        }

        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(401).json(
                {
                    success: false,
                    message: `Email already registered`
                }
            );
        }

        if(password.length < 8) {
            return res.status(400).json(
                {
                    success: false,
                    message: `Password must have 8 characters`
                }
            );
        }

        const mostRecentOtpDocument = await Otp.findOne({email}).sort({createdAt: -1}).limit(1);
        if(!mostRecentOtpDocument) {
            return res.status(400).json(
                {
                    success: false,
                    message: `OTP has been expired`
                }
            );
        }
        if(mostRecentOtpDocument.otp !== otp) {
            return res.status(401).json(
                {
                    success: false,
                    message: `Incorrect otp`
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({name, email, password: hashedPassword, accountType: email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD ? 'Admin' : 'Customer', otps: [mostRecentOtpDocument._id]});

        await mail(user.email,'Registration with Forever🤍','<h3>Congratulations🎉</h3><p>Your email registered successfully</p>');

        const updatedOtp = await Otp.findByIdAndDelete(mostRecentOtpDocument._id);
        const updatedUser = await User.findByIdAndUpdate(user._id,{$pull: {"otps": updatedOtp._id}},{new: true});

        return res.status(201).json(
            {
                success: true,
                data: updatedUser,
                message: `User registered successfully`
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                data: `Error in registerUser`,
                message: error.message
            }
        );
    }
}




exports.loginUser = async (req,res) => {
    try {
        const {email,password} = req.body;

        let existingUser = await User.findOne({email});
        if(!existingUser) {
            return res.status(401).json(
                {
                    success: false,
                    message: `Email not registred`
                }
            );
        }

        const correctPassword = await bcrypt.compare(password,existingUser.password);
        if(!correctPassword) {
            return res.status(401).json(
                {
                    success: false,
                    message: `You have entered incorrect password`
                }
            );
        }

        const payload = {
            _id: existingUser._id,
            accountType: existingUser.accountType
        };
        const loginToken = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"});

        existingUser = existingUser.toObject();
        existingUser.password = undefined;

        const cookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };
        res.cookie("loginToken",loginToken,cookieOptions).status(201).json(
            {
                success: true,
                data: existingUser.accountType,
                message: `Log in successful`
            }
        );

    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                data: `Error in loginUser`,
                message: error.message
            }
        );
    }
}




exports.getUsers = async (req,res) => {
    try {
        const users = await User.find();
        if(users.length === 0) {
            return res.status(404).json(
                {
                    success: false,
                    message: `No users found`
                }
            );
        }
        return res.status(200).json(
            {
                success: true,
                data: users,
                message: `Users fetched successfully`
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                data: `Error in getUsers`,
                message: error.message
            }
        );
    }
}




exports.getUser = async (req,res) => {
    try {
        const {userId} = req.params;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(400).json(
                {
                    success: false,
                    message: `No such user found`
                }
            );
        }
        return res.status(200).json(
            {
                success: true,
                data: user,
                message: `User fetched successfully`
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                data: `Error in generateOtp`,
                message: error.message
            }
        );
    }
}




exports.deleteUser = async (req,res) => {
    try {
        const {userId} = req.params;
        if(!userId) {
            return res.status(400).json(
                {
                    success: false,
                    message: `userId is missing`
                }
            );
        }
        const user = await User.findById(userId);
        if(!user) {
            return res.status(400).json(
                {
                    success: false,
                    message: `User not found`
                }
            );
        }
        return res.status(200).json(
            {
                success: true,
                data: user,
                message: `User deleted successfully`
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                data: `Error in deleteUser`,
                message: error.message
            }
        );
    }
}



exports.logoutUser = async (req,res) => {
    try {
        res.clearCookie("loginToken",{
            httpOnly: true,
        });
        return res.status(200).json(
            {
                success: true,
                message: `User logged out successfully`
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                data: `Error in logoutUser`,
                message: error.message
            }
        );
    }
}