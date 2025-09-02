



const cloudinary = require('cloudinary').v2;




const cloudinaryUploader = async (file, folder, resource_type = "auto") => {
    try {
        const cloudinaryOptions = { folder, resource_type };
        return await cloudinary.uploader.upload(file.tempFilePath, cloudinaryOptions);
    } catch (error) {
        console.log(`Error in cloudinaryUploader`);
        console.log(error);
        throw error;
    }
}




module.exports = cloudinaryUploader;