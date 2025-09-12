



const jwt = require('jsonwebtoken');
require('dotenv').config();




// check user exist in local storage but in cookie or not
exports.checkUser = async (req, res) => {
    try {
        const customerLoginToken = req.cookies.customerLoginToken;
        if (!customerLoginToken) {
            return res.status(401).json(
                {
                    success: false,
                    message: `session expired login again`
                }
            );
        }
        const verifiedToken = jwt.verify(customerLoginToken, process.env.JWT_SECRET);
        return res.status(200).json(
            {
                success: true,
                data: verifiedToken._id
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




// authenticate customer
exports.authCustomer = (req, res, next) => {
    try {
        const customerLoginToken = req.cookies.customerLoginToken;
        if (!customerLoginToken) {
            return res.status(401).json(
                {
                    success: false,
                    message: `session expired login again`
                }
            );
        }
        const verifiedToken = jwt.verify(customerLoginToken, process.env.JWT_SECRET);
        if (!verifiedToken) {
            return res.status(401).json(
                {
                    success: false,
                    message: `invalid token`
                }
            );
        }
        if (verifiedToken.accountType !== 'Customer') {
            return res.status(403).json(
                {
                    success: false,
                    message: `only for customers`
                }
            );
        }
        req.user = verifiedToken;
        next();
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        );
    }
}




// authenticate admin
exports.authAdmin = (req, res, next) => {
    try {
        const adminLoginToken = req.cookies.adminLoginToken;
        if (!adminLoginToken) {
            return res.status(401).json(
                {
                    success: false,
                    message: `session expired login again`
                }
            );
        }
        const verifiedToken = jwt.verify(adminLoginToken, process.env.JWT_SECRET);
        if (!verifiedToken) {
            return res.status(401).json(
                {
                    success: false,
                    message: `invalid token`
                }
            );
        }
        if (verifiedToken.accountType !== 'Admin') {
            return res.status(403).json(
                {
                    success: false,
                    message: `only for admin`
                }
            );
        }
        req.user = verifiedToken;
        next();
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        );
    }
}