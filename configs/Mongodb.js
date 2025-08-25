const mongoose = require('mongoose');
require('dotenv').config();

const mongodbConnect = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log(`Server connected to MongoDB`))
    .catch((error) => {
        console.log(`Server failed to connect MongoDB`);
        console.log(error);
        process.exit(1);
    });
}

module.exports = mongodbConnect;