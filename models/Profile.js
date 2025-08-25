const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
    {
        profilePicture: { type: String },
        bio: { type: String },
        dob: { type: String },
        gender: { type: String, enum: ['Male','Female','Others'] },
    }
);

module.exports = mongoose.model("Profile",profileSchema);