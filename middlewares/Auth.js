const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req,res,next) => {
    try {
        const loginToken = req.cookies.loginToken;
        if(!loginToken) {
            return res.status(404).json(
                {
                    success: false,
                    message: `need to login or signup first`
                }
            );
        }
        const decodedLoginToken = jwt.verify(loginToken,process.env.JWT_SECRET);
        req.user = decodedLoginToken;
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




exports.isAdmin = (req,res,next) => {
    try {
        if(req.user.accountType !== 'Admin') {
            return res.status(401).json(
                {
                    success: false,
                    message: `O Oh!! Only Admin`
                }
            );
        }
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