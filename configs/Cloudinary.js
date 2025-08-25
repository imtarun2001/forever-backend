const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const cloudinaryConnect = () => {
    try {
        cloudinary.config(
            {
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.API_KEY,
                api_secret: process.env.API_SECRET
            }
        );
        console.log(`Server connected to Cloudinary`);
    } catch (error) {
        console.log(`Server failed to connect Cloudinary`);
        console.log(error);
        process.exit(1);
    }
}

module.exports = cloudinaryConnect;