const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const expressFileUpload = require('express-fileupload');
const cors = require('cors');
const allowedOrigins = ['http://localhost:3000','http://localhost:3500','https://forever-frontend-eight-xi.vercel.app','https://forever-admin-brown-one.vercel.app'];
require('dotenv').config();
const userRouter = require('./routes/User');
const otpRouter = require('./routes/Otp');
const productRouter = require('./routes/Product');
const cartRouter = require('./routes/Cart');
const orderRouter = require('./routes/Order');
const mongodbConnect = require('./configs/Mongodb');
const cloudinaryConnect = require('./configs/Cloudinary');
const PORT = process.env.PORT || 5000;



app.use(express.json());
app.use(cookieParser());
app.use(expressFileUpload(
    {
        useTempFiles: true,
        tempFileDir: '/tmp'
    }
));
app.use(cors(
    {
        origin: allowedOrigins,
        credentials: true,
    }
));

app.use("/forever/v1",userRouter,otpRouter,productRouter,cartRouter,orderRouter);
mongodbConnect();
cloudinaryConnect();
app.listen(PORT,() => console.log(`Server started at ${PORT} port`));