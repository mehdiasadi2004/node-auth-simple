const Image = require("../models/Image")
const { uploudToCloudinary } = require ("../helpers/cloudinaryHelper")
const fs= require("fs");
const { image } = require("../config/cloudinary");
const cloudinary = require("../config/cloudinary");


const uploudImageController = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        succuss: false,
        message: "file is required please uploud anb image",
      });}

      // uploud to cloudinary


      const { url, publicId } = await uploudToCloudinary(req.file.path);

      // store to mongo db
      const newlyUploudedimage = new Image({
        url,
        publicId,
        uploudedBy: req.userInfo.userId,
      });

      await newlyUploudedimage.save();

    //   delete file from local storage 
    fs.unlinkSync(req.file.path)
      res.status(201).json({
        succuss: true,
        message: "image uplouded succussfully",
        iamge: newlyUploudedimage,
      });
    
  } catch (error) {
    res.status(500).json({
      succuss: false,
      message: "internal server Error",
    });
  }
};


const getAllImagesController = async (req,res)=>{
    try {

      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 5;
      const skip = ( page - 1 )* limit

      const sortBy = req.query.sortBy || "createdAt"
      const sortOrder = req.query.sortOrder === "asc" ? 1:-1
      const totalImage = await Image.countDocuments()
      const totalPages = Math.ceil(totalImage/limit);

      const sortObj={}
      sortObj[sortBy] = sortOrder;

        const images = await Image.find({}).sort(sortObj).skip(skip).limit(limit)

        if (images) {
            res.status(200).json({
                succuss : true,
                currentPage : page,
                totalPages : totalPages,
                totalImages : totalImage,
                data : images,
                
            })
        }


    } catch (error) {
        res.status(500).json({
            succuss: false,
            message: "internal server Error",
          });
    }
};


// delete image 

const deleteImageController = async (req,res)=>{
    try {
        const imageId = req.params.id;
        const userId = req.userInfo.userId;
        const image = await Image.findById(imageId)

        if (!image) {
            return res.status(404).json({
                succuss : false,
                message : "image not found"
            })
        }
        // check if the user is the owner of the image
        if (image.uploudedBy.toString() !== userId) {
            return res.status(403).json({
                succuss : false,
                message : "you are not authorized to delete this image"
            })
        }
        // delete from cloudinary
        await cloudinary.uploader.destroy(image.publicId)   
        // delete from mongo db
        await Image.findByIdAndDelete(image._id)
        res.status(200).json({
            succuss : true,
            message : "image deleted successfully"
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            succuss: false,
            message: "internal server Error",
          });
    }
};



module.exports = {
  uploudImageController,
  getAllImagesController,
  deleteImageController,
};