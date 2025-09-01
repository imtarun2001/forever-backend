const User = require('../models/User');
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




// log in user
exports.loginUser = async (req, res) => {
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
        const loginToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

        existingUser = existingUser.toObject();
        existingUser.password = undefined;

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };
        res.cookie("loginToken", loginToken, cookieOptions).status(201).json(
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
        const user = await User.findById(userId);
        if (!user) {
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
                message: error.message
            }
        );
    }
}



// log out user
exports.logoutUser = async (req, res) => {
    try {
        const { _id } = req.user;
        if (!_id) {
            return res.status(400).json(
                {
                    success: false,
                    message: `log in first to logout`
                }
            )
        }
        res.clearCookie("loginToken", {
            httpOnly: true,
        });
        return res.status(200).json(
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
        const userId = jwt.verify(forgotPasswordTokenFromFrontend, process.env.JWT_SECRET);  // As I have sent userId as string while jwt.sign(), I can simply destructure it
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




exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json(
                {
                    success: false,
                    message: `please register first`
                }
            );
        }
        if (user.accountType !== 'Admin') {
            return res.status(404).json(
                {
                    success: false,
                    message: `only for admin`
                }
            );
        }
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            return res.status(401).json(
                {
                    success: false,
                    message: `incorrect password`
                }
            );
        }
        const payload = {
            _id: user._id,
            accountType: user.accountType
        };
        const loginToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
        const cookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            secure: true
        };
        res.cookie('loginToken', loginToken, cookieOptions).status(200).json(
            {
                success: true,
                data: user.accountType,
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