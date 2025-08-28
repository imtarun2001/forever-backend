const express = require('express');

const otpRouter = express.Router();

const {generateOtp} = require('../controllers/Otp');

otpRouter.post("/otp/generateOtp",generateOtp);

module.exports = otpRouter;