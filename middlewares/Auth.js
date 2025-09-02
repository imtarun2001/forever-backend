



const jwt = require('jsonwebtoken');
require('dotenv').config();




// authenticate customer
exports.authCustomer = (req, res, next) => {
    try {
        const customerLoginToken = req.cookies.customerLoginToken;
        if (!customerLoginToken) {
            return res.status(404).json(
                {
                    success: false,
                    message: `login required`
                }
            );
        }
        const verifiedToken = jwt.verify(customerLoginToken, process.env.JWT_SECRET);
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
                    message: `login required`
                }
            );
        }
        const verifiedToken = jwt.verify(adminLoginToken, process.env.JWT_SECRET);
        if (verifiedToken.accountType !== 'Admin') {
            return res.status(401).json(
                {
                    success: false,
                    message: `O Oh!! Only Admin`
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