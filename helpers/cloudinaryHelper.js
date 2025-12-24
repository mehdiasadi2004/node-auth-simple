const cloudinary = require("../config/cloudinary")

const uploudToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath,{
            folder : "authApp"
        })
        
        return {
            url : result.secure_url,
            publicId : result.public_id
        }

        
    } catch (error) {
        console.log("cloudinary uploud error",error)
        throw new Error("cloudinary uploud error")
    }
}

module.exports = {
    uploudToCloudinary
}