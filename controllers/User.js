



const User = require('../models/User');
const Order = require('../models/Order');
const Otp = require('../models/Otp');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mail = require('../utils/Mail');
const passwordResetTemplate = require('../templates/ResetPassword');
const accountCreationTemplate = require('../templates/AccountCreation');
const accountLoggedInTemplate = require('../templates/AccountLoggedIn');
require('dotenv').config();




// sign up user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json(
                {
                    success: false,
                    message: `Please provide a valid email`
                }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json(
                {
                    success: false,
                    message: `Email already registered`
                }
            );
        }

        if (password.length < 8) {
            return res.status(400).json(
                {
                    success: false,
                    message: `Password must have 8 characters`
                }
            );
        }

        const mostRecentOtpDocument = await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        if (!mostRecentOtpDocument) {
            return res.status(400).json(
                {
                    success: false,
                    message: `OTP has been expired`
                }
            );
        }
        if (mostRecentOtpDocument.otp !== otp) {
            return res.status(401).json(
                {
                    success: false,
                    message: `Incorrect OTP`
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword, accountType: email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD ? 'Admin' : 'Customer', otps: [mostRecentOtpDocument._id] });

        await mail(user.email, 'Registration with Forever🤍', accountCreationTemplate(user.name));

        const updatedOtp = await Otp.findByIdAndDelete(mostRecentOtpDocument._id);
        const updatedUser = await User.findByIdAndUpdate(user._id, { $pull: { "otps": updatedOtp._id } }, { new: true });

        return res.status(201).json(
            {
                success: true,
                data: updatedUser,
                message: `registration successful`
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




// log in customer
exports.customerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        let existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json(
                {
                    success: false,
                    message: `Email not registred`
                }
            );
        }

        const correctPassword = await bcrypt.compare(password, existingUser.password);
        if (!correctPassword) {
            return res.status(401).json(
                {
                    success: false,
                    message: `incorrect password`
                }
            );
        }

        const payload = {
            _id: existingUser._id,
            accountType: existingUser.accountType
        };
        const customerLoginToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

        existingUser = existingUser.toObject();
        existingUser.password = undefined;

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };
        res.cookie("customerLoginToken", customerLoginToken, cookieOptions).status(201).json(
            {
                success: true,
                data: existingUser.accountType,
                message: `welcome back ${existingUser.name.split(' ').shift()}`
            }
        );
        await mail(existingUser.email, `Account Logged In`, accountLoggedInTemplate(existingUser.name));

    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        );
    }
}




// log out customer
exports.customerLogout = async (req, res) => {
    try {
        return res.clearCookie("customerLoginToken", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }).status(200).json(
            {
                success: true,
                message: `logged out`
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




// login admin
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json(
                {
                    success: false,
                    message: `please register first`
                }
            );
        }
        const correctPassword = await bcrypt.compare(password, existingUser.password);
        if (!correctPassword) {
            return res.status(401).json(
                {
                    success: false,
                    message: `incorrect password`
                }
            );
        }
        const payload = {
            _id: existingUser._id,
            accountType: existingUser.accountType
        };
        const adminLoginToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };
        res.cookie('adminLoginToken', adminLoginToken, cookieOptions).status(200).json(
            {
                success: true,
                data: existingUser.accountType,
                message: `welcome back admin`
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




// logout admin
exports.adminLogout = async (req, res) => {
    try {
        return res.clearCookie("adminLoginToken", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }).status(200).json(
            {
                success: true,
                message: `logged out`
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




// get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
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
                message: error.message
            }
        );
    }
}




// get one user
exports.getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
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
                message: error.message
            }
        );
    }
}




// delete one user
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json(
                {
                    success: false,
                    message: `userId is missing`
                }
            );
        }
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(400).json(
                {
                    success: false,
                    message: `User not found`
                }
            );
        }
        await Order.deleteMany({ user: userId });
        return res.status(200).json(
            {
                success: true,
                data: user,
                message: `user and it's orders deleted successfully`
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




// send a link to email who forgot password
exports.forgotPasswordLinkToEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json(
                {
                    success: false,
                    message: `Email not registered`
                }
            );
        }
        const forgotPasswordToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });
        await mail(email, `Password Reset Request 🔒`, passwordResetTemplate(`https://forever-frontend-eight-xi.vercel.app/verify-email/${forgotPasswordToken}`));
        return res.status(201).json(
            {
                success: true,
                message: `check your email`
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




// after verification of the link reset the password
exports.forgotPassword = async (req, res) => {
    try {
        const { forgotPasswordTokenFromFrontend, newPassword } = req.body;
        const userId = jwt.verify(forgotPasswordTokenFromFrontend, process.env.JWT_SECRET);
        if (!userId) {
            return res.status(401).json(
                {
                    success: false,
                    message: `Link expired`
                }
            );
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const existingUser = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
        if (!existingUser) {
            return res.status(401).json(
                {
                    success: false,
                    message: `You may be a hacker, but do not mess with developer😎`
                }
            );
        }
        return res.status(200).json(
            {
                success: true,
                message: `password reset successful`
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